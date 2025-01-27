import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { kanbanService } from '../../services/api';
import Notification from '../../components/Notification';

interface KanbanCard {
  id: number;
  title: string;
  description: string;
  type: 'improvement' | 'implementation' | 'bug' | 'feature';
  status: 'parkingLot' | 'todo' | 'inProgress' | 'done' | 'history';
  createdAt: string;
  updatedAt?: string;
}

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; cardId: number | null }>({
    open: false,
    cardId: null
  });
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [newCard, setNewCard] = useState<Partial<KanbanCard>>({
    type: 'improvement',
    status: 'todo',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Queries
  const { data: cards = [], isLoading, error } = useQuery(
    'kanban-cards',
    () => kanbanService.listar(),
    {
      onError: (error) => {
        console.error('Erro ao carregar cards:', error);
        showNotification('Erro ao carregar cards', 'error');
      }
    }
  );

  // Mutations
  const createMutation = useMutation(
    (card: any) => kanbanService.criar(card),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('kanban-cards');
        setOpen(false);
        setNewCard({ type: 'improvement', status: 'todo' });
        showNotification('Card criado com sucesso', 'success');
      },
      onError: (error) => {
        console.error('Erro ao criar card:', error);
        showNotification('Erro ao criar card', 'error');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => kanbanService.atualizar(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('kanban-cards');
        setEditOpen(false);
        setSelectedCard(null);
        showNotification('Card atualizado com sucesso', 'success');
      },
      onError: (error) => {
        console.error('Erro ao atualizar card:', error);
        showNotification('Erro ao atualizar card', 'error');
      }
    }
  );

  const deleteMutation = useMutation(
    (id: number) => kanbanService.excluir(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('kanban-cards');
        setDeleteDialog({ open: false, cardId: null });
        showNotification('Card excluído com sucesso', 'success');
      },
      onError: (error) => {
        console.error('Erro ao excluir card:', error);
        showNotification('Erro ao excluir card', 'error');
      }
    }
  );

  const columns = [
    { id: 'parkingLot', title: 'Ideias Novas' },
    { id: 'todo', title: 'A Fazer' },
    { id: 'inProgress', title: 'Em Progresso' },
    { id: 'done', title: 'Concluído' },
    { id: 'history', title: 'Histórico' },
  ];

  const handleAddCard = () => {
    if (newCard.title && newCard.description) {
      createMutation.mutate(newCard);
    }
  };

  const handleEditCard = () => {
    if (selectedCard) {
      updateMutation.mutate({ 
        id: selectedCard.id, 
        data: selectedCard 
      });
    }
  };

  const handleDeleteClick = (cardId: number) => {
    setDeleteDialog({ open: true, cardId });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.cardId) {
      deleteMutation.mutate(deleteDialog.cardId);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const card = cards.find((c: KanbanCard) => c.id.toString() === result.draggableId);
    
    if (card && source.droppableId !== destination.droppableId) {
      updateMutation.mutate({
        id: card.id,
        data: {
          ...card,
          status: destination.droppableId as KanbanCard['status']
        }
      });
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      improvement: '#4caf50',
      implementation: '#2196f3',
      bug: '#f44336',
      feature: '#ff9800',
    };
    return colors[type as keyof typeof colors];
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      improvement: 'Melhoria',
      implementation: 'Implementação',
      bug: 'Bug',
      feature: 'Funcionalidade',
    };
    return labels[type as keyof typeof labels];
  };

  const formatDate = (date: string) => {
    const parsedDate = parseISO(date);
    return format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatRelativeDate = (date: string) => {
    return formatDistanceToNow(parseISO(date), { 
      addSuffix: true,
      locale: ptBR 
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erro ao carregar o quadro Kanban. Por favor, tente novamente.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quadro Kanban</Typography>
        <IconButton color="primary" onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {columns.map((column) => (
            <Grid item xs={12} md={column.id === 'history' ? 12 : 3} key={column.id}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  minHeight: column.id === 'history' ? 'auto' : '70vh',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {column.title}
                </Typography>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: '100px' }}
                    >
                      <Grid container spacing={2}>
                        {cards
                          .filter((card: KanbanCard) => card.status === column.id)
                          .map((card: KanbanCard, index: number) => (
                            <Grid item xs={column.id === 'history' ? 12 : 12} key={card.id}>
                              <Draggable
                                draggableId={card.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      transform: snapshot.isDragging ? 'rotate(3deg)' : 'none',
                                      transition: 'transform 0.2s',
                                    }}
                                  >
                                    <CardContent>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="h6">{card.title}</Typography>
                                        <Box>
                                          <IconButton 
                                            size="small"
                                            onClick={() => {
                                              setSelectedCard(card);
                                              setEditOpen(true);
                                            }}
                                          >
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                          <IconButton 
                                            size="small" 
                                            onClick={() => handleDeleteClick(card.id)}
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      </Box>
                                      <Chip 
                                        label={getTypeLabel(card.type)}
                                        size="small"
                                        sx={{ 
                                          bgcolor: getTypeColor(card.type),
                                          color: 'white',
                                          mb: 1 
                                        }}
                                      />
                                      <Typography variant="body2" sx={{ mb: 1 }}>{card.description}</Typography>
                                      <Box sx={{ mt: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
                                        <Tooltip title={formatDate(card.createdAt)} arrow>
                                          <Typography variant="caption" display="block">
                                            Criado {formatRelativeDate(card.createdAt)}
                                          </Typography>
                                        </Tooltip>
                                        {card.updatedAt && (
                                          <Tooltip title={formatDate(card.updatedAt)} arrow>
                                            <Typography variant="caption" display="block">
                                              Atualizado {formatRelativeDate(card.updatedAt)}
                                            </Typography>
                                          </Tooltip>
                                        )}
                                      </Box>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            </Grid>
                          ))}
                      </Grid>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      {/* Dialog de Novo Card */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={newCard.title || ''}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            multiline
            rows={4}
            value={newCard.description || ''}
            onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={newCard.type || 'improvement'}
              label="Tipo"
              onChange={(e) => setNewCard({ ...newCard, type: e.target.value as any })}
            >
              <MenuItem value="improvement">Melhoria</MenuItem>
              <MenuItem value="implementation">Implementação</MenuItem>
              <MenuItem value="bug">Bug</MenuItem>
              <MenuItem value="feature">Funcionalidade</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newCard.status || 'todo'}
              label="Status"
              onChange={(e) => setNewCard({ ...newCard, status: e.target.value as any })}
            >
              <MenuItem value="parkingLot">Ideias Novas</MenuItem>
              <MenuItem value="todo">A Fazer</MenuItem>
              <MenuItem value="inProgress">Em Progresso</MenuItem>
              <MenuItem value="done">Concluído</MenuItem>
              <MenuItem value="history">Histórico</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddCard} 
            color="primary"
            disabled={createMutation.isLoading}
          >
            {createMutation.isLoading ? 'Salvando...' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Editar Card */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          {selectedCard && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Título"
                fullWidth
                value={selectedCard.title}
                onChange={(e) => setSelectedCard({ ...selectedCard, title: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Descrição"
                fullWidth
                multiline
                rows={4}
                value={selectedCard.description}
                onChange={(e) => setSelectedCard({ ...selectedCard, description: e.target.value })}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={selectedCard.type}
                  label="Tipo"
                  onChange={(e) => setSelectedCard({ ...selectedCard, type: e.target.value as any })}
                >
                  <MenuItem value="improvement">Melhoria</MenuItem>
                  <MenuItem value="implementation">Implementação</MenuItem>
                  <MenuItem value="bug">Bug</MenuItem>
                  <MenuItem value="feature">Funcionalidade</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedCard.status}
                  label="Status"
                  onChange={(e) => setSelectedCard({ ...selectedCard, status: e.target.value as any })}
                >
                  <MenuItem value="parkingLot">Ideias Novas</MenuItem>
                  <MenuItem value="todo">A Fazer</MenuItem>
                  <MenuItem value="inProgress">Em Progresso</MenuItem>
                  <MenuItem value="done">Concluído</MenuItem>
                  <MenuItem value="history">Histórico</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
                <Typography variant="caption" display="block">
                  Criado em: {formatDate(selectedCard.createdAt)}
                </Typography>
                {selectedCard.updatedAt && (
                  <Typography variant="caption" display="block">
                    Última atualização: {formatDate(selectedCard.updatedAt)}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleEditCard} 
            color="primary"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, cardId: null })}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir este card?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, cardId: null })}>Cancelar</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? 'Excluindo...' : 'Excluir'}
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