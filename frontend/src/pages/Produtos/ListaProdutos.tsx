import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { produtosService } from '../../services/api';
import Notification from '../../components/Notification';

export default function ListaProdutos() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, produtoId: null });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Query para buscar produtos
  const { data: produtos, isLoading, isError } = useQuery(
    'produtos',
    () => produtosService.listar(),
    {
      retry: 2,
      onError: (error) => {
        console.error('Erro ao carregar produtos:', error);
        setNotification({
          open: true,
          message: 'Erro ao carregar produtos. Tente novamente.',
          severity: 'error'
        });
      }
    }
  );

  // Mutation para deletar produto
  const deleteMutation = useMutation(
    (id: number) => produtosService.excluir(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('produtos');
        setNotification({
          open: true,
          message: 'Produto excluído com sucesso!',
          severity: 'success'
        });
        setDeleteDialog({ open: false, produtoId: null });
      },
      onError: () => {
        setNotification({
          open: true,
          message: 'Erro ao excluir produto',
          severity: 'error'
        });
      }
    }
  );

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={2}>
        <Alert severity="error">
          Erro ao carregar produtos. Por favor, tente novamente.
        </Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => queryClient.invalidateQueries('produtos')}
          >
            Tentar Novamente
          </Button>
        </Box>
      </Box>
    );
  }

  if (!produtos?.data?.length) {
    return (
      <Box p={2}>
        <Alert severity="info">
          Nenhum produto cadastrado.
        </Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/produtos/novo')}
          >
            Adicionar Produto
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">
          Lista de Produtos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/produtos/novo')}
        >
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.data.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>
                  <Chip 
                    label={produto.categoria?.nome || 'Sem categoria'} 
                    size="small" 
                    color={produto.categoria ? "primary" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(produto.preco)}
                </TableCell>
                <TableCell>{produto.quantidade}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/produtos/${produto.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, produtoId: produto.id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, produtoId: null })}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este produto?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDelete(deleteDialog.produtoId)}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
          <Button 
            onClick={() => setDeleteDialog({ open: false, produtoId: null })}
            variant="outlined"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
} 