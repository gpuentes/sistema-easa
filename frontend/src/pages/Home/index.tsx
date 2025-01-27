import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  SwapHoriz as SwapHorizIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

export default function Home() {
  const navigate = useNavigate();

  const menuCards = [
    {
      title: 'Produtos',
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      description: 'Gerenciar produtos do estoque',
      path: '/produtos',
      color: '#1976d2'
    },
    {
      title: 'Categorias',
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
      description: 'Organizar categorias',
      path: '/categorias',
      color: '#2196f3'
    },
    {
      title: 'Movimentações',
      icon: <SwapHorizIcon sx={{ fontSize: 40 }} />,
      description: 'Controlar entradas e saídas',
      path: '/movimentacoes',
      color: '#4caf50'
    },
    {
      title: 'Relatórios',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      description: 'Visualizar relatórios',
      path: '/relatorios',
      color: '#ff9800'
    },
    {
      title: 'Kanban',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      description: 'Gerenciar tarefas',
      path: '/kanban',
      color: '#9c27b0'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Sistema ASA
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {menuCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(card.path)}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${card.color}15`,
                  color: card.color,
                  mb: 2,
                }}
              >
                {card.icon}
              </Box>
              
              <Typography variant="h6" gutterBottom>
                {card.title}
              </Typography>
              
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 2 }}
              >
                {card.description}
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                sx={{ color: card.color, borderColor: card.color }}
              >
                Acessar
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 