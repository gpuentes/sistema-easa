const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Listar todos os cards
router.get('/', async (req, res) => {
  console.log('GET /api/kanban - Iniciando busca de cards');
  try {
    const cards = await prisma.kanbanCard.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    console.log('GET /api/kanban - Cards encontrados:', cards.length);
    res.json(cards);
  } catch (error) {
    console.error('GET /api/kanban - Erro ao buscar cards:', error);
    res.status(500).json({ error: 'Erro ao buscar cards' });
  }
});

// Criar novo card
router.post('/', async (req, res) => {
  console.log('POST /api/kanban - Criando novo card:', req.body);
  const { title, description, type, status } = req.body;

  if (!title || !description || !type || !status) {
    console.error('POST /api/kanban - Campos obrigatórios não preenchidos');
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const card = await prisma.kanbanCard.create({
      data: {
        title,
        description,
        type,
        status,
      },
    });
    console.log('POST /api/kanban - Card criado:', card);
    res.status(201).json(card);
  } catch (error) {
    console.error('POST /api/kanban - Erro ao criar card:', error);
    res.status(500).json({ error: 'Erro ao criar card' });
  }
});

// Atualizar card
router.put('/:id', async (req, res) => {
  console.log('PUT /api/kanban/:id - Atualizando card:', req.params.id, req.body);
  const { id } = req.params;
  const { title, description, type, status } = req.body;

  try {
    const card = await prisma.kanbanCard.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        type,
        status,
      },
    });
    console.log('PUT /api/kanban/:id - Card atualizado:', card);
    res.json(card);
  } catch (error) {
    console.error('PUT /api/kanban/:id - Erro ao atualizar card:', error);
    res.status(500).json({ error: 'Erro ao atualizar card' });
  }
});

// Excluir card
router.delete('/:id', async (req, res) => {
  console.log('DELETE /api/kanban/:id - Excluindo card:', req.params.id);
  const { id } = req.params;

  try {
    await prisma.kanbanCard.delete({
      where: { id: Number(id) },
    });
    console.log('DELETE /api/kanban/:id - Card excluído com sucesso');
    res.status(204).send();
  } catch (error) {
    console.error('DELETE /api/kanban/:id - Erro ao excluir card:', error);
    res.status(500).json({ error: 'Erro ao excluir card' });
  }
});

module.exports = router; 