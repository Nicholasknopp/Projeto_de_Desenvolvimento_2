import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';

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

// Rota para marcar notificação como lida
router.patch('/:id/lida', auth, async (req, res) => {
  try {
    const notificacaoId = parseInt(req.params.id);
    const usuarioId = req.usuario.id;

    const notificacao = await prisma.notificacao.findFirst({
      where: {
        id: notificacaoId,
        usuarioId
      }
    });

    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    const notificacaoAtualizada = await prisma.notificacao.update({
      where: { id: notificacaoId },
      data: { lida: true }
    });

    res.json(notificacaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    res.status(500).json({ error: 'Erro ao atualizar notificação' });
  }
});

// Rota para excluir notificação
router.delete('/:id', auth, async (req, res) => {
  try {
    const notificacaoId = parseInt(req.params.id);
    const usuarioId = req.usuario.id;

    const notificacao = await prisma.notificacao.findFirst({
      where: {
        id: notificacaoId,
        usuarioId
      }
    });

    if (!notificacao) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    await prisma.notificacao.delete({
      where: { id: notificacaoId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir notificação:', error);
    res.status(500).json({ error: 'Erro ao excluir notificação' });
  }
});

export default router;