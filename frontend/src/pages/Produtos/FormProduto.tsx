import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { produtosService, categoriasService } from '../../services/api';
import Notification from '../../components/Notification';

interface Categoria {
  id: number;
  nome: string;
}

interface Notification {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export default function FormProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [produto, setProduto] = useState({
    nome: '',
    descricao: '',
    categoriaId: '',
    quantidade: '',
    preco: ''
  });

  // Query para buscar categorias
  const { data: categorias, isLoading: isLoadingCategorias } = useQuery(
    'categorias',
    () => categoriasService.listar(),
    {
      onError: (error) => {
        console.error('Erro ao carregar categorias:', error);
        showNotification('Erro ao carregar categorias', 'error');
      }
    }
  );

  // Query para buscar produto específico (se estiver editando)
  const { isLoading: isLoadingProduto } = useQuery(
    ['produto', id],
    () => produtosService.buscarPorId(parseInt(id!)),
    {
      enabled: !!id,
      onSuccess: (response) => {
        const produtoData = response.data;
        setProduto({
          nome: produtoData.nome || '',
          descricao: produtoData.descricao || '',
          categoriaId: produtoData.categoriaId?.toString() || '',
          quantidade: produtoData.quantidade?.toString() || '',
          preco: produtoData.preco?.toString() || ''
        });
      },
      onError: (error) => {
        console.error('Erro ao carregar produto:', error);
        showNotification('Erro ao carregar produto', 'error');
      }
    }
  );

  // Mutation para criar/atualizar produto
  const mutation = useMutation(
    (dadosProduto: any) => {
      if (id) {
        return produtosService.atualizar(parseInt(id), dadosProduto);
      }
      return produtosService.criar(dadosProduto);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('produtos');
        showNotification(
          id ? 'Produto atualizado com sucesso' : 'Produto criado com sucesso',
          'success'
        );
        navigate('/produtos');
      },
      onError: (error) => {
        console.error('Erro ao salvar produto:', error);
        showNotification('Erro ao salvar produto', 'error');
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto.categoriaId || !produto.nome || !produto.preco) {
      showNotification('Preencha todos os campos obrigatórios', 'error');
      return;
    }
    
    const dadosParaSalvar = {
      ...produto,
      categoriaId: parseInt(produto.categoriaId),
      quantidade: produto.quantidade ? parseFloat(produto.quantidade) : 0,
      preco: produto.preco ? parseFloat(produto.preco) : 0
    };

    mutation.mutate(dadosParaSalvar);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  if (isLoadingProduto || isLoadingCategorias) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!categorias || !categorias.data || categorias.data.length === 0) {
    return (
      <Box p={2}>
        <Alert severity="warning">
          Não há categorias cadastradas. Cadastre uma categoria primeiro.
        </Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/categorias/nova')}
          >
            Cadastrar Categoria
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Editar Produto' : 'Novo Produto'}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            select
            label="Categoria"
            name="categoriaId"
            value={produto.categoriaId}
            onChange={handleChange}
            margin="normal"
            required
            error={!produto.categoriaId}
            helperText={!produto.categoriaId ? 'Selecione uma categoria' : ''}
          >
            {categorias?.data?.map((categoria: Categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={produto.nome}
            onChange={handleChange}
            margin="normal"
            required
            error={!produto.nome}
            helperText={!produto.nome ? 'Digite o nome do produto' : ''}
          />

          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={produto.descricao}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Preço"
            name="preco"
            type="number"
            value={produto.preco}
            onChange={handleChange}
            margin="normal"
            required
            error={!produto.preco}
            helperText={!produto.preco ? 'Digite o preço do produto' : ''}
            InputProps={{
              startAdornment: 'R$',
              inputProps: { min: 0, step: 0.01 }
            }}
          />

          <TextField
            fullWidth
            label="Quantidade"
            name="quantidade"
            type="number"
            value={produto.quantidade}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              inputProps: { min: 0 }
            }}
          />

          <Box mt={3} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/produtos')}
              disabled={mutation.isLoading}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
} 