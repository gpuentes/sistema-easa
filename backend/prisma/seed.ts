import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const novasCategorias = [
  // Produtos
  { nome: 'Alimentos', tipo: 'PRODUTOS', unidade: 'quantidade' },
  { nome: 'Kits de Higiene', tipo: 'PRODUTOS', unidade: 'quantidade' },
  { nome: 'Cestas Básicas', tipo: 'PRODUTOS', unidade: 'quantidade' },
  { nome: 'Roupas', tipo: 'PRODUTOS', unidade: 'quantidade' },
  { nome: 'Sapatos', tipo: 'PRODUTOS', unidade: 'quantidade' },
  { nome: 'Brinquedos', tipo: 'PRODUTOS', unidade: 'quantidade' },
  
  // Pessoas
  { nome: 'Famílias Beneficiadas', tipo: 'PESSOAS', unidade: 'quantidade' },
  { nome: 'Pessoas Beneficiadas', tipo: 'PESSOAS', unidade: 'quantidade' },
  
  // Doações
  { nome: 'Igreja', tipo: 'DOACOES', unidade: 'valor' },
  { nome: 'Fundo Social', tipo: 'DOACOES', unidade: 'valor' },
  { nome: 'Outras Doações', tipo: 'DOACOES', unidade: 'valor' },
];

async function main() {
  try {
    console.log('Iniciando atualização das categorias...');
    
    // Buscar categorias existentes
    const categoriasExistentes = await prisma.categoria.findMany();
    console.log(`Encontradas ${categoriasExistentes.length} categorias existentes`);

    // Filtrar apenas categorias novas que não existem ainda
    const categoriasParaAdicionar = novasCategorias.filter(nova => 
      !categoriasExistentes.some(existente => 
        existente.nome.toLowerCase() === nova.nome.toLowerCase()
      )
    );

    console.log(`Serão adicionadas ${categoriasParaAdicionar.length} novas categorias`);
    
    // Adicionar apenas as categorias novas
    for (const categoria of categoriasParaAdicionar) {
      await prisma.categoria.create({
        data: {
          ...categoria,
          descricao: `Categoria para controle de ${categoria.nome.toLowerCase()}`
        }
      });
      console.log(`Categoria "${categoria.nome}" criada com sucesso`);
    }

    console.log('Atualização finalizada com sucesso!');
    
    // Listar todas as categorias atuais
    const todasCategorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' }
    });
    
    console.log('\nCategorias atuais:');
    todasCategorias.forEach(cat => {
      console.log(`- ${cat.nome} (${cat.tipo})`);
    });
    
  } catch (error) {
    console.error('Erro durante a atualização:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Erro fatal durante a atualização:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 