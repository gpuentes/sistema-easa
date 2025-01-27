const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todas as categorias
router.get('/', async (req, res) => {
  try {
    console.log('Buscando todas as categorias...');
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: 'asc'
      }
    });
    console.log(`Encontradas ${categorias.length} categorias`);
    res.json(categorias);
  } catch (error) {
    console.error('Erro detalhado ao listar categorias:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar categorias',
      details: error.message 
    });
  }
});

// Buscar categoria por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) }
    });
    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({ error: 'Categoria não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
});

// Criar nova categoria
router.post('/', async (req, res) => {
  const { nome, descricao, tipo, unidade } = req.body;
  try {
    const categoria = await prisma.categoria.create({
      data: {
        nome,
        descricao,
        tipo,
        unidade
      }
    });
    res.status(201).json(categoria);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// Atualizar categoria
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, tipo, unidade } = req.body;
  try {
    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        tipo,
        unidade
      }
    });
    res.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

// Deletar categoria
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.categoria.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

module.exports = router; 