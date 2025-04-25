const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('./middleware/auth');

const prisma = new PrismaClient();
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Rotas
app.use('/api/notificacoes', notificacoesRouter);

// Rota de login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ error: 'Usuário inativo' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() }
    });

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, cargo: usuario.cargo } });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

// Rota de registro de usuário
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;
    const senhaHash = await bcrypt.hash(senha, 8);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        cargo
      }
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cargo: usuario.cargo
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Testar conexão com o banco de dados
prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  });

// Rota para cadastrar medicamento
app.post('/api/medicamentos', auth, async (req, res) => {
  try {
    const medicamento = await prisma.medicamento.create({
      data: req.body
    });
    res.status(201).json(medicamento);
  } catch (error) {
    console.error('Erro ao cadastrar medicamento:', error);
    res.status(500).json({ error: 'Erro ao cadastrar medicamento' });
  }
});

// Rota para listar medicamentos
app.get('/api/medicamentos', async (req, res) => {
  try {
    const medicamentos = await prisma.medicamento.findMany({
      include: {
        movimentacoes: {
          select: {
            tipo: true,
            quantidade: true,
            data: true,
            responsavel: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    const medicamentosProcessados = medicamentos.map(med => ({
      ...med,
      diasParaVencer: Math.ceil((new Date(med.validade) - new Date()) / (1000 * 60 * 60 * 24)),
      status: med.quantidade <= 10 ? 'BAIXO_ESTOQUE' : 'NORMAL'
    }));

    res.json(medicamentosProcessados);
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
});

// Rota para buscar medicamento por ID
app.get('/api/medicamentos/:id', async (req, res) => {
  try {
    const medicamento = await prisma.medicamento.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (medicamento) {
      res.json(medicamento);
    } else {
      res.status(404).json({ error: 'Medicamento não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar medicamento:', error);
    res.status(500).json({ error: 'Erro ao buscar medicamento' });
  }
});

// Rota para registrar movimentação
app.post('/api/movimentacoes', auth, async (req, res) => {
  try {
    const { medicamentoId, tipo, quantidade } = req.body;
    const medicamento = await prisma.medicamento.findUnique({
      where: { id: medicamentoId }
    });

    if (!medicamento) {
      return res.status(404).json({ error: 'Medicamento não encontrado' });
    }

    const novaQuantidade = tipo === 'entrada' 
      ? medicamento.quantidade + quantidade
      : medicamento.quantidade - quantidade;

    const [movimentacao, updatedMedicamento] = await prisma.$transaction([
      prisma.movimentacao.create({
        data: req.body
      }),
      prisma.medicamento.update({
        where: { id: medicamentoId },
        data: { quantidade: novaQuantidade }
      })
    ]);
    res.status(201).json(movimentacao);
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    res.status(500).json({ error: 'Erro ao registrar movimentação' });
  }
});

// Rota para listar movimentações
app.get('/api/movimentacoes', async (req, res) => {
  try {
    const { startDate, endDate, medicamentoId } = req.query;
    let whereClause = {};

    if (startDate && endDate) {
      whereClause.data = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (medicamentoId) {
      whereClause.medicamentoId = parseInt(medicamentoId);
    }

    const movimentacoes = await prisma.movimentacao.findMany({
      where: whereClause,
      include: {
        medicamento: {
          select: {
            nome: true,
            quantidade: true,
            validade: true,
            lote: true
          }
        }
      },
      orderBy: {
        data: 'desc'
      }
    });

    const movimentacoesProcessadas = movimentacoes.map(mov => ({
      ...mov,
      impactoEstoque: mov.tipo === 'entrada' ? '+' + mov.quantidade : '-' + mov.quantidade
    }));

    res.json(movimentacoesProcessadas);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({ error: 'Erro ao buscar movimentações' });
  }
});



// Rota para atualizar medicamento
app.put('/api/medicamentos/:id', async (req, res) => {
  try {
    const medicamento = await medicamentoModel.update(parseInt(req.params.id), req.body);
    res.json(medicamento);
  } catch (error) {
    console.error('Erro ao atualizar medicamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar medicamento' });
  }
});

// Rota para deletar medicamento
app.delete('/api/medicamentos/:id', async (req, res) => {
  try {
    await prisma.medicamento.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar medicamento:', error);
    res.status(500).json({ error: 'Erro ao deletar medicamento' });
  }
});