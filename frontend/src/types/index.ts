export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  categoriaId: number;
  categoria?: Categoria;
  createdAt: string;
  updatedAt: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Movimento {
  id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  produtoId: number;
  produto?: Produto;
  data: string;
  motivo?: string;
} 