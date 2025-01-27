import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListaProdutos from './pages/Produtos/ListaProdutos';
import FormProduto from './pages/Produtos/FormProduto';
import ListaCategorias from './pages/Categorias/ListaCategorias';
import FormCategoria from './pages/Categorias/FormCategoria';
import KanbanBoard from './pages/Kanban/KanbanBoard';
import MovimentacaoList from './pages/Movimentacao/MovimentacaoList';
import RelatorioMovimentacoes from './pages/Relatorios/RelatorioMovimentacoes';

// Páginas temporárias para teste
const PaginaTemporaria = ({ titulo }: { titulo: string }) => (
  <div style={{ padding: 20 }}>
    <h2>{titulo}</h2>
    <p>Esta página está em desenvolvimento.</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Rotas de Produtos */}
      <Route path="/produtos" element={<ListaProdutos />} />
      <Route path="/produtos/novo" element={<FormProduto />} />
      <Route path="/produtos/:id" element={<FormProduto />} />
      
      {/* Rotas de Categorias */}
      <Route path="/categorias" element={<ListaCategorias />} />
      <Route path="/categorias/nova" element={<FormCategoria />} />
      <Route path="/categorias/:id" element={<FormCategoria />} />
      
      {/* Outras rotas */}
      <Route path="/movimentacoes" element={<MovimentacaoList />} />
      <Route path="/relatorios" element={<RelatorioMovimentacoes />} />
      <Route path="/kanban" element={<KanbanBoard />} />
    </Routes>
  );
} 