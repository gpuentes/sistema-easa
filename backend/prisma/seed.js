const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Criar algumas categorias
    const categorias = await Promise.all([
      prisma.categoria.create({
        data: {
          nome: 'Alimentos',
          descricao: 'Produtos alimentícios',
          tipo: 'PRODUTOS',
          unidade: 'quantidade',
        },
      }),
      prisma.categoria.create({
        data: {
          nome: 'Higiene',
          descricao: 'Produtos de higiene pessoal',
          tipo: 'PRODUTOS',
          unidade: 'quantidade',
        },
      }),
    ]);

    // Criar alguns produtos
    const produtos = await Promise.all([
      prisma.produto.create({
        data: {
          nome: 'Arroz',
          descricao: 'Arroz tipo 1',
          preco: 20.0,
          quantidade: 100,
          categoriaId: categorias[0].id,
        },
      }),
      prisma.produto.create({
        data: {
          nome: 'Feijão',
          descricao: 'Feijão carioca',
          preco: 8.0,
          quantidade: 50,
          categoriaId: categorias[0].id,
        },
      }),
      prisma.produto.create({
        data: {
          nome: 'Sabonete',
          descricao: 'Sabonete neutro',
          preco: 2.5,
          quantidade: 200,
          categoriaId: categorias[1].id,
        },
      }),
    ]);

    // Criar algumas movimentações
    await Promise.all([
      prisma.movimentacao.create({
        data: {
          tipo: 'entrada',
          quantidade: 100,
          produtoId: produtos[0].id,
          observacao: 'Estoque inicial',
        },
      }),
      prisma.movimentacao.create({
        data: {
          tipo: 'entrada',
          quantidade: 50,
          produtoId: produtos[1].id,
          observacao: 'Estoque inicial',
        },
      }),
      prisma.movimentacao.create({
        data: {
          tipo: 'entrada',
          quantidade: 200,
          produtoId: produtos[2].id,
          observacao: 'Estoque inicial',
        },
      }),
      prisma.movimentacao.create({
        data: {
          tipo: 'saida',
          quantidade: 10,
          produtoId: produtos[0].id,
          observacao: 'Doação',
        },
      }),
    ]);

    console.log('Dados de teste inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de teste:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 