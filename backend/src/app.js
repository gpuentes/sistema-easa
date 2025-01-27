const express = require('express');
const cors = require('cors');
const produtosRouter = require('./routes/produtos');
const categoriasRouter = require('./routes/categorias');
const movimentacoesRouter = require('./routes/movimentacoes');
const kanbanRouter = require('./routes/kanban');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/produtos', produtosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/movimentacoes', movimentacoesRouter);
app.use('/api/kanban', kanbanRouter);

module.exports = app; 