import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpar dados existentes
    await prisma.movimentacao.deleteMany();
    await prisma.produto.deleteMany();
    await prisma.categoria.deleteMany();
    await prisma.kanbanCard.deleteMany();

    // Criar categorias
    const categorias = await Promise.all([
      prisma.categoria.create({
        data: {
          nome: 'Alimentos',
          descricao: 'Produtos alimentícios em geral'
        }
      }),
      prisma.categoria.create({
        data: {
          nome: 'Limpeza',
          descricao: 'Produtos de limpeza e higiene'
        }
      }),
      prisma.categoria.create({
        data: {
          nome: 'Bebidas',
          descricao: 'Bebidas em geral'
        }
      }),
      prisma.categoria.create({
        data: {
          nome: 'Papelaria',
          descricao: 'Materiais de escritório'
        }
      })
    ]);

    console.log('Categorias criadas com sucesso!');

    // Criar produtos
    const produtos = await Promise.all([
      // Alimentos
      prisma.produto.create({
        data: {
          nome: 'Arroz',
          descricao: 'Arroz branco tipo 1 - 5kg',
          preco: 22.90,
          quantidade: 100,
          categoriaId: categorias[0].id
        }
      }),
      prisma.produto.create({
        data: {
          nome: 'Feijão',
          descricao: 'Feijão carioca - 1kg',
          preco: 8.90,
          quantidade: 150,
          categoriaId: categorias[0].id
        }
      }),
      prisma.produto.create({
        data: {
          nome: 'Açúcar',
          descricao: 'Açúcar refinado - 1kg',
          preco: 4.50,
          quantidade: 200,
          categoriaId: categorias[0].id
        }
      }),
      // Limpeza
      prisma.produto.create({
        data: {
          nome: 'Detergente',
          descricao: 'Detergente líquido - 500ml',
          preco: 2.50,
          quantidade: 200,
          categoriaId: categorias[1].id
        }
      }),
      prisma.produto.create({
        data: {
          nome: 'Sabão em pó',
          descricao: 'Sabão em pó multiuso - 1kg',
          preco: 15.90,
          quantidade: 80,
          categoriaId: categorias[1].id
        }
      }),
      // Bebidas
      prisma.produto.create({
        data: {
          nome: 'Refrigerante',
          descricao: 'Refrigerante Cola 2L',
          preco: 8.90,
          quantidade: 120,
          categoriaId: categorias[2].id
        }
      }),
      prisma.produto.create({
        data: {
          nome: 'Água Mineral',
          descricao: 'Água mineral sem gás - 500ml',
          preco: 2.00,
          quantidade: 300,
          categoriaId: categorias[2].id
        }
      }),
      // Papelaria
      prisma.produto.create({
        data: {
          nome: 'Papel A4',
          descricao: 'Pacote papel A4 com 500 folhas',
          preco: 25.90,
          quantidade: 50,
          categoriaId: categorias[3].id
        }
      })
    ]);

    console.log('Produtos criados com sucesso!');

    // Criar movimentações
    const movimentacoes = await Promise.all([
      // Entradas
      prisma.movimentacao.create({
        data: {
          tipo: 'ENTRADA',
          quantidade: 50,
          produtoId: produtos[0].id,
          observacao: 'Compra inicial'
        }
      }),
      prisma.movimentacao.create({
        data: {
          tipo: 'ENTRADA',
          quantidade: 30,
          produtoId: produtos[1].id,
          observacao: 'Reposição de estoque'
        }
      }),
      prisma.movimentacao.create({
        data: {
          tipo: 'ENTRADA',
          quantidade: 100,
          produtoId: produtos[2].id,
          observacao: 'Compra promocional'
        }
      }),
      // Saídas
      prisma.movimentacao.create({
        data: {
          tipo: 'SAIDA',
          quantidade: 10,
          produtoId: produtos[3].id,
          observacao: 'Venda para cliente'
        }
      }),
      prisma.movimentacao.create({
        data: {
          tipo: 'SAIDA',
          quantidade: 5,
          produtoId: produtos[4].id,
          observacao: 'Uso interno'
        }
      }),
      prisma.movimentacao.create({
        data: {
          tipo: 'SAIDA',
          quantidade: 20,
          produtoId: produtos[5].id,
          observacao: 'Venda em atacado'
        }
      })
    ]);

    console.log('Movimentações criadas com sucesso!');

    // Criar cards do Kanban
    const kanbanCards = await Promise.all([
      // Implementados (done)
      prisma.kanbanCard.create({
        data: {
          title: 'CRUD de Produtos',
          description: 'Implementação do CRUD completo de produtos com validações e associação com categorias',
          type: 'feature',
          status: 'done',
          createdAt: new Date('2024-01-22T10:00:00'),
          updatedAt: new Date('2024-01-22T16:00:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'CRUD de Categorias',
          description: 'Implementação do CRUD de categorias com validações',
          type: 'feature',
          status: 'done',
          createdAt: new Date('2024-01-22T11:00:00'),
          updatedAt: new Date('2024-01-22T15:00:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'Layout Responsivo',
          description: 'Menu lateral responsivo com Material-UI e tema personalizado',
          type: 'improvement',
          status: 'done',
          createdAt: new Date('2024-01-22T13:00:00'),
          updatedAt: new Date('2024-01-22T17:00:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'Sistema de Movimentações',
          description: 'Implementação do sistema de entrada e saída de produtos com validações',
          type: 'feature',
          status: 'done',
          createdAt: new Date('2024-01-23T09:00:00'),
          updatedAt: new Date('2024-01-23T14:00:00')
        }
      }),
      // Em andamento (doing)
      prisma.kanbanCard.create({
        data: {
          title: 'Sistema de Relatórios',
          description: 'Implementação de relatórios de estoque e movimentações com gráficos',
          type: 'feature',
          status: 'doing',
          createdAt: new Date('2024-01-23T15:00:00'),
          updatedAt: new Date('2024-01-23T15:00:00')
        }
      }),
      // A fazer (todo)
      prisma.kanbanCard.create({
        data: {
          title: 'Filtros Avançados',
          description: 'Adicionar filtros avançados na listagem de movimentações por data, tipo e produto',
          type: 'improvement',
          status: 'todo',
          createdAt: new Date('2024-01-23T10:00:00'),
          updatedAt: new Date('2024-01-23T10:00:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'Edição de Movimentações',
          description: 'Permitir editar e excluir movimentações com log de alterações',
          type: 'feature',
          status: 'todo',
          createdAt: new Date('2024-01-23T10:30:00'),
          updatedAt: new Date('2024-01-23T10:30:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'Paginação no Servidor',
          description: 'Implementar paginação no servidor para todas as listagens',
          type: 'improvement',
          status: 'todo',
          createdAt: new Date('2024-01-23T11:00:00'),
          updatedAt: new Date('2024-01-23T11:00:00')
        }
      }),
      // Ideias Novas (parkingLot)
      prisma.kanbanCard.create({
        data: {
          title: 'Dashboard Personalizado',
          description: 'Dashboard com widgets configuráveis e gráficos interativos',
          type: 'feature',
          status: 'parkingLot',
          createdAt: new Date('2024-01-23T12:00:00'),
          updatedAt: new Date('2024-01-23T12:00:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'Exportação de Dados',
          description: 'Permitir exportar relatórios e listagens em PDF e Excel',
          type: 'feature',
          status: 'parkingLot',
          createdAt: new Date('2024-01-23T12:30:00'),
          updatedAt: new Date('2024-01-23T12:30:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'Notificações',
          description: 'Sistema de notificações para estoque baixo e movimentações importantes',
          type: 'feature',
          status: 'parkingLot',
          createdAt: new Date('2024-01-23T13:00:00'),
          updatedAt: new Date('2024-01-23T13:00:00')
        }
      }),
      // Histórico (history)
      prisma.kanbanCard.create({
        data: {
          title: 'Configuração Inicial',
          description: 'Setup do projeto com React, TypeScript, Material-UI e Prisma',
          type: 'feature',
          status: 'history',
          createdAt: new Date('2024-01-22T09:00:00'),
          updatedAt: new Date('2024-01-22T09:30:00')
        }
      }),
      prisma.kanbanCard.create({
        data: {
          title: 'Modelagem do Banco',
          description: 'Criação do modelo de dados com Prisma Schema',
          type: 'feature',
          status: 'history',
          createdAt: new Date('2024-01-22T09:30:00'),
          updatedAt: new Date('2024-01-22T10:00:00')
        }
      })
    ]);

    console.log('Cards do Kanban criados com sucesso!');

  } catch (error) {
    console.error('Erro ao criar dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 