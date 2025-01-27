import axios from 'axios';

// Configuração do axios
export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para logs
api.interceptors.request.use(request => {
  console.log('🚀 Request:', {
    method: request.method,
    url: request.url,
    baseURL: request.baseURL,
    data: request.data,
    headers: request.headers
  });
  return request;
}, error => {
  console.error('❌ Request Error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => {
    console.log('✅ Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('❌ Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

// Serviço de produtos
export const produtosService = {
  listar: async () => {
    console.log('📦 Listando produtos...');
    try {
      const response = await api.get('/produtos');
      console.log('📦 Produtos recebidos:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error('📦 Erro ao listar produtos:', error);
      throw error;
    }
  },

  buscarPorId: async (id: number) => {
    console.log(`📦 Buscando produto ${id}...`);
    try {
      const response = await api.get(`/produtos/${id}`);
      console.log('📦 Produto recebido:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error(`📦 Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  criar: async (produto: any) => {
    console.log('📦 Criando produto:', produto);
    try {
      const response = await api.post('/produtos', produto);
      console.log('📦 Produto criado:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error('📦 Erro ao criar produto:', error);
      throw error;
    }
  },

  atualizar: async (id: number, produto: any) => {
    console.log(`📦 Atualizando produto ${id}:`, produto);
    try {
      const response = await api.put(`/produtos/${id}`, produto);
      console.log('📦 Produto atualizado:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error(`📦 Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  excluir: async (id: number) => {
    console.log(`📦 Excluindo produto ${id}...`);
    try {
      await api.delete(`/produtos/${id}`);
    } catch (error) {
      console.error(`📦 Erro ao excluir produto ${id}:`, error);
      throw error;
    }
  }
};

// Serviço de categorias
export const categoriasService = {
  listar: async () => {
    console.log('📑 Listando categorias...');
    try {
      const response = await api.get('/categorias');
      console.log('📑 Categorias recebidas:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error('📑 Erro ao listar categorias:', error);
      throw error;
    }
  },

  buscarPorId: async (id: number) => {
    console.log(`📑 Buscando categoria ${id}...`);
    try {
      const response = await api.get(`/categorias/${id}`);
      console.log('📑 Categoria recebida:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error(`📑 Erro ao buscar categoria ${id}:`, error);
      throw error;
    }
  },

  criar: async (categoria: any) => {
    console.log('📑 Criando categoria:', categoria);
    try {
      const response = await api.post('/categorias', categoria);
      console.log('📑 Categoria criada:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error('📑 Erro ao criar categoria:', error);
      throw error;
    }
  },

  atualizar: async (id: number, categoria: any) => {
    console.log(`📑 Atualizando categoria ${id}:`, categoria);
    try {
      const response = await api.put(`/categorias/${id}`, categoria);
      console.log('📑 Categoria atualizada:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error(`📑 Erro ao atualizar categoria ${id}:`, error);
      throw error;
    }
  },

  excluir: async (id: number) => {
    console.log(`📑 Excluindo categoria ${id}...`);
    try {
      await api.delete(`/categorias/${id}`);
    } catch (error) {
      console.error(`📑 Erro ao excluir categoria ${id}:`, error);
      throw error;
    }
  }
};

// Serviço de movimentações
export const movimentacoesService = {
  listar: async () => {
    console.log('🔄 Listando movimentações...');
    try {
      const response = await api.get('/movimentacoes');
      console.log('🔄 Movimentações recebidas:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error('🔄 Erro ao listar movimentações:', error);
      throw error;
    }
  },

  buscarPorId: async (id: number) => {
    console.log(`🔄 Buscando movimentação ${id}...`);
    try {
      const response = await api.get(`/movimentacoes/${id}`);
      console.log('🔄 Movimentação recebida:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error(`🔄 Erro ao buscar movimentação ${id}:`, error);
      throw error;
    }
  },

  criar: async (movimentacao: any) => {
    console.log('🔄 Criando movimentação:', movimentacao);
    try {
      const response = await api.post('/movimentacoes', movimentacao);
      console.log('🔄 Movimentação criada:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error('🔄 Erro ao criar movimentação:', error);
      throw error;
    }
  },

  atualizar: async (id: number, movimentacao: any) => {
    console.log(`🔄 Atualizando movimentação ${id}:`, movimentacao);
    try {
      const response = await api.put(`/movimentacoes/${id}`, movimentacao);
      console.log('🔄 Movimentação atualizada:', response.data);
      return { data: response.data };
    } catch (error) {
      console.error(`🔄 Erro ao atualizar movimentação ${id}:`, error);
      throw error;
    }
  },

  excluir: async (id: number) => {
    console.log(`🔄 Excluindo movimentação ${id}...`);
    try {
      await api.delete(`/movimentacoes/${id}`);
    } catch (error) {
      console.error(`🔄 Erro ao excluir movimentação ${id}:`, error);
      throw error;
    }
  }
};

// Serviço de Kanban
export const kanbanService = {
  listar: async () => {
    console.log('🎯 Listando cards do kanban...');
    try {
      const response = await api.get('/kanban');
      console.log('🎯 Cards recebidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('🎯 Erro ao listar cards:', error);
      throw error;
    }
  },

  criar: async (card: any) => {
    console.log('🎯 Criando card:', card);
    try {
      const response = await api.post('/kanban', card);
      console.log('🎯 Card criado:', response.data);
      return response.data;
    } catch (error) {
      console.error('🎯 Erro ao criar card:', error);
      throw error;
    }
  },

  atualizar: async (id: number, card: any) => {
    console.log(`🎯 Atualizando card ${id}:`, card);
    try {
      const response = await api.put(`/kanban/${id}`, card);
      console.log('🎯 Card atualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`🎯 Erro ao atualizar card ${id}:`, error);
      throw error;
    }
  },

  excluir: async (id: number) => {
    console.log(`🎯 Excluindo card ${id}...`);
    try {
      await api.delete(`/kanban/${id}`);
      console.log('🎯 Card excluído com sucesso');
    } catch (error) {
      console.error(`🎯 Erro ao excluir card ${id}:`, error);
      throw error;
    }
  }
};

export default api; 