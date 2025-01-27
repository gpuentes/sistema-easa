import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  SwapHoriz as SwapHorizIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isMenuActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { text: 'Início', icon: <HomeIcon />, path: '/' },
    { text: 'Produtos', icon: <InventoryIcon />, path: '/produtos' },
    { text: 'Categorias', icon: <CategoryIcon />, path: '/categorias' },
    { text: 'Movimentações', icon: <SwapHorizIcon />, path: '/movimentacoes' },
    { text: 'Relatórios', icon: <AssessmentIcon />, path: '/relatorios' },
    { text: 'Kanban', icon: <DashboardIcon />, path: '/kanban' },
  ];

  const drawer = (
    <div>
      <Toolbar 
        sx={{ 
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
        onClick={() => {
          navigate('/');
          setMobileOpen(false);
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Sistema ASA
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={isMenuActive(item.path)}
            onClick={() => setMobileOpen(false)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isMenuActive(item.path) ? 'primary.main' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                color: isMenuActive(item.path) ? 'primary.main' : 'inherit',
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sistema de Estoque ASA
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 