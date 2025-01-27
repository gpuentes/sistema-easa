const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Tenta executar uma query simples
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!');
    console.log('Detalhes da conexão:', process.env.DATABASE_URL);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com o PostgreSQL:');
    console.error('Mensagem:', error.message);
    console.error('Detalhes da conexão:', process.env.DATABASE_URL);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Executa o teste
testConnection(); 