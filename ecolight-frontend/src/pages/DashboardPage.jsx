import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  EventNote as EventNoteIcon,
  RecyclingOutlined as RecyclingIcon,
} from '@mui/icons-material';
import authService from '../services/auth.service';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [nextCollections, setNextCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = authService.getCurrentUser();
      setUser(userData);

      // Simulation des données - À remplacer par de vrais appels API
      setTimeout(() => {
        setSubscriptions([
          {
            id: 1,
            collector_nom: 'EcoCollect Pro',
            statut: 'actif',
            date_subscription: '2024-01-15',
          },
          {
            id: 2,
            collector_nom: 'Green Waste Solutions',
            statut: 'actif',
            date_subscription: '2024-01-20',
          },
        ]);

        setNextCollections([
          {
            collector: 'EcoCollect Pro',
            jour: 'Lundi',
            heure: '06:00',
            type_dechet: 'Déchets ménagers',
            zone: 'Yaoundé Centre',
          },
          {
            collector: 'Green Waste Solutions',
            jour: 'Mardi',
            heure: '07:00',
            type_dechet: 'Déchets recyclables',
            zone: 'Douala I',
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  const getJourColor = (jour) => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    return jour.toLowerCase() === today.toLowerCase() ? 'error' : 'default';
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
        Tableau de bord
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Carte de bienvenue */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Bienvenue, {user?.nom || 'Utilisateur'} !
            </Typography>
            <Typography variant="body1">
              Gérez facilement vos collectes de déchets avec Ecolight
            </Typography>
          </Paper>
        </Grid>

        {/* Statistiques rapides */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Abonnements actifs
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {subscriptions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EventNoteIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Prochaines collectes
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {nextCollections.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <RecyclingIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Impact écologique
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                +15%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary" variant="body2">
                  Ponctualité
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                98%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Mes abonnements */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Mes abonnements
            </Typography>
            {subscriptions.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 3 }}>
                Aucun abonnement actif
              </Typography>
            ) : (
              <List>
                {subscriptions.map((sub) => (
                  <ListItem key={sub.id}>
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={sub.collector_nom}
                      secondary={`Depuis le ${new Date(
                        sub.date_subscription
                      ).toLocaleDateString('fr-FR')}`}
                    />
                    <Chip
                      label={sub.statut}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Prochaines collectes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Prochaines collectes
            </Typography>
            {nextCollections.length === 0 ? (
              <Typography color="textSecondary" sx={{ py: 3 }}>
                Aucune collecte programmée
              </Typography>
            ) : (
              <List>
                {nextCollections.map((collection, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1">
                            {collection.collector}
                          </Typography>
                          <Chip
                            label={collection.jour}
                            size="small"
                            color={getJourColor(collection.jour)}
                          />
                        </Box>
                      }
                      secondary={`${collection.heure} - ${collection.type_dechet} (${collection.zone})`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;