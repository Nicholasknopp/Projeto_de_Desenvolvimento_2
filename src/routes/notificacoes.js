const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Rota para criar uma nova notificação
router.post('/', auth, async (req, res) => {
  try {
    const { titulo, mensagem, data, usuarioId } = req.body;
    const notificacao = await prisma.notificacao.create({
      data: {
        titulo,
        mensagem,
        data: new Date(data),
        usuarioId
      }
    });
    res.status(201).json(notificacao);
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    res.status(500).json({ error: 'Erro ao criar notificação' });
  }
});

// Rota para buscar notificações do usuário
router.get('/', auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const notificacoes = await prisma.notificacao.findMany({
      where: {
        usuarioId,
        data: {
          gte: new Date()
        }
      },
      orderBy: {
        data: 'asc'
      }
    });
    res.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

module.exports = router;