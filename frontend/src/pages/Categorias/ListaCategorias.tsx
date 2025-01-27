import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { categoriasService } from '../../services/api';
import Notification from '../../components/Notification';

// Função auxiliar para obter a cor do chip baseado no tipo
const getChipColor = (tipo: string) => {
  switch (tipo) {
    case 'PRODUTOS':
      return 'primary';
    case 'PESSOAS':
      return 'secondary';
    case 'DOACOES':
      return 'success';
    case 'ACOES':
      return 'warning';
    default:
      return 'default';
  }
};

export default function ListaCategorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, categoriaId: null });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const carregarCategorias = async () => {
    try {
      console.log('Carregando categorias...');
      const response = await categoriasService.listar();
      console.log('Categorias carregadas:', response.data);
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setNotification({
        open: true,
        message: 'Erro ao carregar categorias: ' + (error.response?.data?.details || error.message),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleDelete = async (id) => {
    try {
      await categoriasService.excluir(id);
      setNotification({
        open: true,
        message: 'Categoria excluída com sucesso!',
        severity: 'success'
      });
      carregarCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setNotification({
        open: true,
        message: 'Erro ao excluir categoria',
        severity: 'error'
      });
    }
    setDeleteDialog({ open: false, categoriaId: null });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/categorias/novo')}
        >
          Nova Categoria
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow 
                key={categoria.id}
                hover
                sx={{ '&:hover': { cursor: 'pointer' } }}
              >
                <TableCell>{categoria.nome}</TableCell>
                <TableCell>{categoria.descricao}</TableCell>
                <TableCell>
                  <Chip 
                    label={categoria.tipo} 
                    color={getChipColor(categoria.tipo)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{categoria.unidade}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/categorias/${categoria.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteDialog({ open: true, categoriaId: categoria.id })}
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
        onClose={() => setDeleteDialog({ open: false, categoriaId: null })}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir esta categoria?
          Esta ação não pode ser desfeita e pode afetar produtos relacionados.
        </DialogContent>
        <DialogActions sx={{ padding: 2, justifyContent: 'flex-start' }}>
          <Button
            onClick={() => handleDelete(deleteDialog.categoriaId)}
            color="error"
            variant="contained"
            sx={{ mr: 2 }}
          >
            Excluir
          </Button>
          <Button 
            onClick={() => setDeleteDialog({ open: false, categoriaId: null })}
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