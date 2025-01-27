import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { 
  DataGrid, 
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { movimentacoesService, produtosService } from '../../services/api.ts';
import Notification from '../../components/Notification';

interface Movimentacao {
  id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  data: string;
  observacao?: string;
}

export default function MovimentacaoList() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as const
  });
  const [novaMovimentacao, setNovaMovimentacao] = useState<Partial<Movimentacao>>({
    tipo: 'ENTRADA',
  });
  const [editMode, setEditMode] = useState(false);

  // Queries
  const { data: movimentacoes, isLoading: isLoadingMovimentacoes } = useQuery(
    'movimentacoes',
    () => movimentacoesService.listar(),
    {
      onError: (error) => {
        console.error('Erro ao carregar movimentações:', error);
        showNotification('Erro ao carregar movimentações', 'error');
      }
    }
  );

  const { data: produtos, isLoading: isLoadingProdutos } = useQuery(
    'produtos',
    () => produtosService.listar(),
    {
      onError: (error) => {
        console.error('Erro ao carregar produtos:', error);
        showNotification('Erro ao carregar produtos', 'error');
      }
    }
  );

  // Mutations
  const createMutation = useMutation(
    (movimentacao: any) => movimentacoesService.criar(movimentacao),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('movimentacoes');
        queryClient.invalidateQueries('produtos');
        setDialogOpen(false);
        setNovaMovimentacao({ tipo: 'ENTRADA' });
        showNotification('Movimentação registrada com sucesso', 'success');
      },
      onError: (error: any) => {
        console.error('Erro ao criar movimentação:', error);
        const errorMessage = error.response?.data?.error || 'Erro ao criar movimentação';
        showNotification(errorMessage, 'error');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => movimentacoesService.atualizar(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('movimentacoes');
        queryClient.invalidateQueries('produtos');
        setDialogOpen(false);
        setNovaMovimentacao({ tipo: 'ENTRADA' });
        setEditMode(false);
        showNotification('Movimentação atualizada com sucesso', 'success');
      },
      onError: (error: any) => {
        console.error('Erro ao atualizar movimentação:', error);
        const errorMessage = error.response?.data?.error || 'Erro ao atualizar movimentação';
        showNotification(errorMessage, 'error');
      }
    }
  );

  const deleteMutation = useMutation(
    (id: number) => movimentacoesService.excluir(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('movimentacoes');
        queryClient.invalidateQueries('produtos');
        setDeleteDialog({ open: false, id: null });
        showNotification('Movimentação excluída com sucesso', 'success');
      },
      onError: (error) => {
        console.error('Erro ao excluir movimentação:', error);
        showNotification('Erro ao excluir movimentação', 'error');
      }
    }
  );

  const handleSubmit = () => {
    if (!novaMovimentacao.produtoId || !novaMovimentacao.quantidade) {
      showNotification('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    if (novaMovimentacao.quantidade <= 0) {
      showNotification('A quantidade deve ser maior que zero', 'error');
      return;
    }

    if (editMode && novaMovimentacao.id) {
      updateMutation.mutate({ 
        id: novaMovimentacao.id, 
        data: novaMovimentacao 
      });
    } else {
      createMutation.mutate(novaMovimentacao);
    }
  };

  const handleEdit = (movimentacao: Movimentacao) => {
    setNovaMovimentacao(movimentacao);
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = () => {
    if (deleteDialog.id) {
      deleteMutation.mutate(deleteDialog.id);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'tipo',
      headerName: 'Tipo',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'ENTRADA' ? 'Entrada' : 'Saída'}
          color={params.value === 'ENTRADA' ? 'success' : 'error'}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'produtoNome',
      headerName: 'Produto',
      width: 200,
    },
    {
      field: 'quantidade',
      headerName: 'Quantidade',
      width: 130,
      type: 'number',
    },
    {
      field: 'data',
      headerName: 'Data',
      width: 200,
      valueFormatter: (params) => {
        return format(new Date(params.value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
      },
    },
    {
      field: 'observacao',
      headerName: 'Observação',
      width: 300,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => handleEdit(params.row)}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoadingMovimentacoes || isLoadingProdutos) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Movimentações</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditMode(false);
            setNovaMovimentacao({ tipo: 'ENTRADA' });
            setDialogOpen(true);
          }}
        >
          Nova Movimentação
        </Button>
      </Box>

      {!movimentacoes?.data?.length ? (
        <Alert severity="info">
          Nenhuma movimentação registrada.
        </Alert>
      ) : (
        <DataGrid
          rows={movimentacoes.data}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'data', sort: 'desc' }],
            },
          }}
        />
      )}

      {/* Dialog de Nova/Editar Movimentação */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => {
          setDialogOpen(false);
          setEditMode(false);
          setNovaMovimentacao({ tipo: 'ENTRADA' });
        }}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>{editMode ? 'Editar Movimentação' : 'Nova Movimentação'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={novaMovimentacao.tipo || 'ENTRADA'}
                  label="Tipo"
                  onChange={(e) => setNovaMovimentacao({ 
                    ...novaMovimentacao, 
                    tipo: e.target.value as 'ENTRADA' | 'SAIDA'
                  })}
                >
                  <MenuItem value="ENTRADA">Entrada</MenuItem>
                  <MenuItem value="SAIDA">Saída</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Produto</InputLabel>
                <Select
                  value={novaMovimentacao.produtoId || ''}
                  label="Produto"
                  onChange={(e) => {
                    const produto = produtos?.data?.find(p => p.id === e.target.value);
                    setNovaMovimentacao({ 
                      ...novaMovimentacao, 
                      produtoId: e.target.value as number,
                    });
                  }}
                >
                  {produtos?.data?.map((produto) => (
                    <MenuItem key={produto.id} value={produto.id}>
                      {produto.nome} (Estoque: {produto.quantidade})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={novaMovimentacao.quantidade || ''}
                onChange={(e) => setNovaMovimentacao({
                  ...novaMovimentacao,
                  quantidade: Number(e.target.value)
                })}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observação"
                multiline
                rows={3}
                value={novaMovimentacao.observacao || ''}
                onChange={(e) => setNovaMovimentacao({
                  ...novaMovimentacao,
                  observacao: e.target.value
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              setEditMode(false);
              setNovaMovimentacao({ tipo: 'ENTRADA' });
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir esta movimentação?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificação */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
} 