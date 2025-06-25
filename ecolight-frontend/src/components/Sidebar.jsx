import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Report as ReportIcon,
  Subscriptions as SubscriptionsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  {
    text: 'Tableau de bord',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Mes abonnements',
    icon: <SubscriptionsIcon />,
    path: '/subscriptions',
  },
  {
    text: 'Collecteurs',
    icon: <BusinessIcon />,
    path: '/collectors',
  },
  {
    text: 'Horaires',
    icon: <ScheduleIcon />,
    path: '/schedules',
  },
  {
    text: 'Signalements',
    icon: <ReportIcon />,
    path: '/reports',
  },
];

const bottomMenuItems = [
  {
    text: 'Paramètres',
    icon: <SettingsIcon />,
    path: '/settings',
  },
  {
    text: 'Aide',
    icon: <HelpIcon />,
    path: '/help',
  },
];

function Sidebar({ open }) {
  const navigate = useNavigate();
  const location = useLocation();

  const drawerWidth = 240;

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#FAFAFA',
          borderRight: '1px solid #E0E0E0',
          mt: 8,
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'white' : 'primary.main',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ mx: 2 }} />

        <List sx={{ pb: 2 }}>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ px: 2, py: 1, backgroundColor: '#E8F5E9' }}>
          <Typography variant="caption" color="text.secondary">
            Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;