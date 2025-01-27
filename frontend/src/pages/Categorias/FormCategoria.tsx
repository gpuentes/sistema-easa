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
  Container,
} from '@mui/material';
import { categoriasService } from '../../services/api';
import Notification from '../../components/Notification';

const TIPOS_CATEGORIA = [
  { value: 'PRODUTOS', label: 'Produtos' },
  { value: 'PESSOAS', label: 'Pessoas' },
  { value: 'DOACOES', label: 'Doações' },
  { value: 'ACOES', label: 'Ações' }
];

const TIPOS_UNIDADE = [
  { value: 'quantidade', label: 'Quantidade' },
  { value: 'valor', label: 'Valor' },
  { value: 'texto', label: 'Texto' }
];

export default function FormCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [categoria, setCategoria] = useState({
    nome: '',
    descricao: '',
    tipo: 'PRODUTOS',
    unidade: 'quantidade'
  });

  // Query para buscar categoria específica (se estiver editando)
  const { isLoading: isLoadingCategoria } = useQuery(
    ['categoria', id],
    () => categoriasService.buscarPorId(Number(id)),
    {
      enabled: !!id && !isNaN(Number(id)),
      onSuccess: (response) => {
        if (response?.data) {
          setCategoria({
            nome: response.data.nome,
            descricao: response.data.descricao || '',
            tipo: response.data.tipo,
            unidade: response.data.unidade
          });
        }
      },
      onError: (error: any) => {
        console.error('Erro ao carregar categoria:', error);
        showNotification(error.response?.data?.error || 'Erro ao carregar categoria', 'error');
        navigate('/categorias');
      }
    }
  );

  // Mutation para criar categoria
  const createMutation = useMutation(
    (data: typeof categoria) => categoriasService.criar(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categorias');
        showNotification('Categoria criada com sucesso', 'success');
        navigate('/categorias');
      },
      onError: (error: any) => {
        console.error('Erro ao criar categoria:', error);
        showNotification(error.response?.data?.error || 'Erro ao criar categoria', 'error');
      }
    }
  );

  // Mutation para atualizar categoria
  const updateMutation = useMutation(
    (data: typeof categoria) => {
      if (!id || isNaN(Number(id))) {
        throw new Error('ID inválido para atualização');
      }
      return categoriasService.atualizar(Number(id), data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categorias');
        showNotification('Categoria atualizada com sucesso', 'success');
        navigate('/categorias');
      },
      onError: (error: any) => {
        console.error('Erro ao atualizar categoria:', error);
        showNotification(
          error.message === 'ID inválido para atualização'
            ? 'ID inválido para atualização'
            : error.response?.data?.error || 'Erro ao atualizar categoria',
          'error'
        );
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!categoria.nome?.trim()) {
      showNotification('Preencha o nome da categoria', 'error');
      return;
    }

    if (!categoria.tipo) {
      showNotification('Selecione o tipo da categoria', 'error');
      return;
    }

    if (!categoria.unidade) {
      showNotification('Selecione a unidade da categoria', 'error');
      return;
    }

    const categoriaData = {
      ...categoria,
      nome: categoria.nome.trim(),
      descricao: categoria.descricao?.trim() || ''
    };

    try {
      if (id && !isNaN(Number(id))) {
        // Atualização
        await updateMutation.mutateAsync(categoriaData);
      } else {
        // Criação
        await createMutation.mutateAsync(categoriaData);
      }
    } catch (error) {
      // Erros já são tratados nas mutations
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoria(prev => ({
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

  if (isLoadingCategoria || createMutation.isLoading || updateMutation.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">
            {id ? 'Editar Categoria' : 'Nova Categoria'}
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              value={categoria.nome}
              onChange={handleChange}
              margin="normal"
              required
              error={!categoria.nome?.trim()}
              helperText={!categoria.nome?.trim() ? 'Digite o nome da categoria' : ''}
              autoFocus
            />

            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={categoria.descricao}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              select
              label="Tipo"
              name="tipo"
              value={categoria.tipo}
              onChange={handleChange}
              margin="normal"
              required
            >
              {TIPOS_CATEGORIA.map((tipo) => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Unidade"
              name="unidade"
              value={categoria.unidade}
              onChange={handleChange}
              margin="normal"
              required
            >
              {TIPOS_UNIDADE.map((unidade) => (
                <MenuItem key={unidade.value} value={unidade.value}>
                  {unidade.label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/categorias')}
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={createMutation.isLoading || updateMutation.isLoading}
              >
                {createMutation.isLoading || updateMutation.isLoading ? 'Salvando...' : 'Salvar'}
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
    </Container>
  );
} 