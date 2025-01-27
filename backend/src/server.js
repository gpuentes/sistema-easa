const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001; // Forçando a porta 3001

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

// Middlewares
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Controle de Estoque' });
});

// Rotas de produtos
const produtosRoutes = require('./routes/produtos');
app.use('/api/produtos', produtosRoutes);
console.log('✅ Rotas de produtos registradas');

// Rotas de categorias
const categoriasRoutes = require('./routes/categorias');
app.use('/api/categorias', categoriasRoutes);
console.log('✅ Rotas de categorias registradas');

// Rotas de movimentações
const movimentacoesRouter = require('./routes/movimentacoes');
app.use('/api/movimentacoes', movimentacoesRouter);
console.log('✅ Rotas de movimentações registradas');

// Rotas do Kanban
const kanbanRouter = require('./routes/kanban');
app.use('/api/kanban', kanbanRouter);
console.log('✅ Rotas do Kanban registradas');

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Teste de conexão com o banco
prisma.$connect()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida');
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
      console.log('\nURLs de acesso:');
      console.log(`- API: http://localhost:${PORT}`);
      console.log(`- Produtos: http://localhost:${PORT}/api/produtos`);
      console.log(`- Categorias: http://localhost:${PORT}/api/categorias`);
      console.log(`- Movimentações: http://localhost:${PORT}/api/movimentacoes`);
      console.log(`- Kanban: http://localhost:${PORT}/api/kanban`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }); 