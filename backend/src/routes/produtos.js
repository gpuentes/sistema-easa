const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    console.log('Buscando todos os produtos...');
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: true
      },
      orderBy: {
        nome: 'asc'
      }
    });
    console.log(`Encontrados ${produtos.length} produtos`);
    res.json(produtos);
  } catch (error) {
    console.error('Erro detalhado ao listar produtos:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar produtos',
      details: error.message 
    });
  }
});

// Buscar produto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Buscando produto ${id}...`);
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true
      }
    });
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ error: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Criar novo produto
router.post('/', async (req, res) => {
  const { nome, descricao, preco, quantidade, categoriaId } = req.body;
  try {
    // Verificar se a categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(categoriaId) }
    });

    if (!categoria) {
      return res.status(400).json({ error: 'Categoria não encontrada' });
    }

    console.log('Criando novo produto:', { nome, categoriaId });
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: preco ? parseFloat(preco) : null,
        quantidade: parseInt(quantidade),
        categoriaId: parseInt(categoriaId)
      },
      include: {
        categoria: true
      }
    });
    console.log('Produto criado com sucesso:', produto.id);
    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade, categoriaId } = req.body;
  try {
    // Verificar se a categoria existe
    if (categoriaId) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: parseInt(categoriaId) }
      });

      if (!categoria) {
        return res.status(400).json({ error: 'Categoria não encontrada' });
      }
    }

    console.log(`Atualizando produto ${id}...`);
    const produto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        preco: preco ? parseFloat(preco) : null,
        quantidade: quantidade ? parseInt(quantidade) : undefined,
        categoriaId: categoriaId ? parseInt(categoriaId) : undefined
      },
      include: {
        categoria: true
      }
    });
    console.log('Produto atualizado com sucesso');
    res.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Deletando produto ${id}...`);
    await prisma.produto.delete({
      where: { id: parseInt(id) }
    });
    console.log('Produto deletado com sucesso');
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

module.exports = router; 