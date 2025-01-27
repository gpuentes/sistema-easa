const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Listar todas as movimentações
router.get('/', async (req, res) => {
  try {
    const movimentacoes = await prisma.movimentacao.findMany({
      include: {
        produto: {
          select: {
            nome: true,
            quantidade: true,
          },
        },
      },
      orderBy: {
        data: 'desc',
      },
    });

    // Formata os dados para o frontend
    const movimentacoesFormatadas = movimentacoes.map(mov => ({
      id: mov.id,
      tipo: mov.tipo,
      quantidade: mov.quantidade,
      data: mov.data,
      observacao: mov.observacao,
      produtoId: mov.produtoId,
      produtoNome: mov.produto.nome,
    }));

    res.json(movimentacoesFormatadas);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({ error: 'Erro ao buscar movimentações' });
  }
});

// Buscar uma movimentação específica
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movimentacao = await prisma.movimentacao.findUnique({
      where: { id: Number(id) },
      include: {
        produto: {
          select: {
            nome: true,
            quantidade: true,
          },
        },
      },
    });

    if (!movimentacao) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }

    res.json({
      ...movimentacao,
      produtoNome: movimentacao.produto.nome,
    });
  } catch (error) {
    console.error('Erro ao buscar movimentação:', error);
    res.status(500).json({ error: 'Erro ao buscar movimentação' });
  }
});

// Criar nova movimentação
router.post('/', async (req, res) => {
  const { tipo, quantidade, produtoId, observacao } = req.body;

  if (!tipo || !quantidade || !produtoId) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  if (quantidade <= 0) {
    return res.status(400).json({ error: 'A quantidade deve ser maior que zero' });
  }

  try {
    // Busca o produto atual
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Calcula nova quantidade
    let novaQuantidade = produto.quantidade;
    if (tipo === 'ENTRADA') {
      novaQuantidade += quantidade;
    } else if (tipo === 'SAIDA') {
      if (quantidade > produto.quantidade) {
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
      }
      novaQuantidade -= quantidade;
    }

    // Cria a movimentação e atualiza o produto em uma transação
    const result = await prisma.$transaction([
      prisma.movimentacao.create({
        data: {
          tipo,
          quantidade,
          produtoId,
          observacao,
        },
        include: {
          produto: {
            select: {
              nome: true,
            },
          },
        },
      }),
      prisma.produto.update({
        where: { id: produtoId },
        data: { quantidade: novaQuantidade },
      }),
    ]);

    // Retorna a movimentação criada com o nome do produto
    res.status(201).json({
      ...result[0],
      produtoNome: result[0].produto.nome,
    });
  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    res.status(500).json({ error: 'Erro ao criar movimentação' });
  }
});

// Excluir movimentação
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Busca a movimentação
    const movimentacao = await prisma.movimentacao.findUnique({
      where: { id: Number(id) },
    });

    if (!movimentacao) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }

    // Busca o produto
    const produto = await prisma.produto.findUnique({
      where: { id: movimentacao.produtoId },
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Calcula nova quantidade
    let novaQuantidade = produto.quantidade;
    if (movimentacao.tipo === 'ENTRADA') {
      novaQuantidade -= movimentacao.quantidade;
      if (novaQuantidade < 0) {
        return res.status(400).json({ error: 'Não é possível excluir esta movimentação pois resultaria em estoque negativo' });
      }
    } else if (movimentacao.tipo === 'SAIDA') {
      novaQuantidade += movimentacao.quantidade;
    }

    // Exclui a movimentação e atualiza o produto em uma transação
    await prisma.$transaction([
      prisma.movimentacao.delete({
        where: { id: Number(id) },
      }),
      prisma.produto.update({
        where: { id: movimentacao.produtoId },
        data: { quantidade: novaQuantidade },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir movimentação:', error);
    res.status(500).json({ error: 'Erro ao excluir movimentação' });
  }
});

// Atualizar movimentação
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tipo, quantidade, produtoId, observacao } = req.body;

  try {
    // Busca a movimentação atual
    const movimentacaoAtual = await prisma.movimentacao.findUnique({
      where: { id: Number(id) },
      include: {
        produto: true,
      },
    });

    if (!movimentacaoAtual) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }

    // Se o produto foi alterado, verifica se o novo produto existe
    if (produtoId && produtoId !== movimentacaoAtual.produtoId) {
      const novoProduto = await prisma.produto.findUnique({
        where: { id: produtoId },
      });

      if (!novoProduto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
    }

    // Calcula as alterações no estoque
    const produtoAtual = movimentacaoAtual.produto;
    let quantidadeAtualProduto = produtoAtual.quantidade;

    // Reverte a movimentação anterior
    if (movimentacaoAtual.tipo === 'ENTRADA') {
      quantidadeAtualProduto -= movimentacaoAtual.quantidade;
    } else {
      quantidadeAtualProduto += movimentacaoAtual.quantidade;
    }

    // Aplica a nova movimentação
    if (tipo === 'ENTRADA') {
      quantidadeAtualProduto += quantidade;
    } else {
      if (quantidade > quantidadeAtualProduto) {
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
      }
      quantidadeAtualProduto -= quantidade;
    }

    // Atualiza a movimentação e o produto em uma transação
    const result = await prisma.$transaction([
      prisma.movimentacao.update({
        where: { id: Number(id) },
        data: {
          tipo,
          quantidade,
          produtoId: produtoId || movimentacaoAtual.produtoId,
          observacao,
        },
        include: {
          produto: {
            select: {
              nome: true,
            },
          },
        },
      }),
      prisma.produto.update({
        where: { id: produtoId || movimentacaoAtual.produtoId },
        data: { quantidade: quantidadeAtualProduto },
      }),
    ]);

    // Retorna a movimentação atualizada
    res.json({
      ...result[0],
      produtoNome: result[0].produto.nome,
    });
  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
    res.status(500).json({ error: 'Erro ao atualizar movimentação' });
  }
});

module.exports = router; 