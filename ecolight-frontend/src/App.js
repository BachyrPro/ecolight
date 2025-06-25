// filepath: c:\Users\Ayuk Nyamndi\Desktop\Nouveau dossier (2)\Nouveau dossier\ecolight-frontend\src\App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CollectorsPage from './pages/CollectorsPage';
import CollectorDetailsPage from './pages/CollectorDetailsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ReportsPage from './pages/ReportsPage';
import SchedulePage from './pages/SchedulePage';
import NotificationsPage from './pages/NotificationsPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { isAuthenticated, setupAxiosInterceptors } from './utils/jwt.utils';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    console.log('🔄 Vérification authentification au démarrage...');
    
    // Configurer les intercepteurs axios
    setupAxiosInterceptors(axios);
    
    const authStatus = isAuthenticated();
    console.log('🔐 Statut authentification:', authStatus);
    setIsAuth(authStatus);
  }, []);

  const handleLogin = () => {
    console.log('✅ Utilisateur connecté');
    setIsAuth(true);
  };

  const handleLogout = () => {
    console.log('🚪 Utilisateur déconnecté');
    setIsAuth(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onToggleSidebar={toggleSidebar} onLogout={handleLogout} />
      <Sidebar open={sidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? '240px' : '0px',
          transition: 'margin-left 0.3s',
        }}
      >
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/collectors" element={<CollectorsPage />} />
          <Route path="/collectors/:id" element={<CollectorDetailsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;