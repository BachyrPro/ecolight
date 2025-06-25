import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import collectorService from '../services/collector.service';
import subscriptionService from '../services/subscription.service';
import scheduleService from '../services/schedule.service';

function CollectorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [collector, setCollector] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger les détails du collecteur
      const collectorData = await collectorService.getCollectorById(id);
      setCollector(collectorData);

      // Charger les horaires du collecteur
      try {
        const schedulesData = await scheduleService.getCollectorSchedules(id);
        setSchedules(schedulesData);
      } catch (schedError) {
        console.log('⚠️ Pas d\'horaires disponibles pour ce collecteur');
        setSchedules([]);
      }

      // Charger les abonnements de l'utilisateur
      try {
        const subscriptionsData = await subscriptionService.getUserSubscriptions();
        setUserSubscriptions(subscriptionsData);
      } catch (subError) {
        console.log('⚠️ Erreur lors du chargement des abonnements:', subError);
        setUserSubscriptions([]);
      }

    } catch (err) {
      console.error('💥 Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des détails du collecteur');
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = () => {
    return userSubscriptions.some(sub => 
      sub.collector_id == id || sub.id == id
    );
  };

  const handleSubscribe = () => {
    setConfirmDialog(true);
  };

  const confirmSubscription = async () => {
    try {
      setSubscribing(true);
      await subscriptionService.createSubscription(parseInt(id));
      
      // Recharger les abonnements
      const subscriptionsData = await subscriptionService.getUserSubscriptions();
      setUserSubscriptions(subscriptionsData);
      
      setSnackbar({
        open: true,
        message: `Vous êtes maintenant abonné à ${collector.nom} !`,
        severity: 'success'
      });
      
      setConfirmDialog(false);
    } catch (error) {
      console.error('💥 Erreur lors de l\'abonnement:', error);
      let errorMessage = 'Erreur lors de l\'abonnement';
      
      if (error.response?.status === 409) {
        errorMessage = 'Vous êtes déjà abonné à ce collecteur';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>Chargement des détails...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/collectors')}
        >
          Retour aux collecteurs
        </Button>
      </Container>
    );
  }

  if (!collector) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Collecteur non trouvé
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/collectors')}
        >
          Retour aux collecteurs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/collectors')}
          variant="outlined"
        >
          Retour
        </Button>
        
        {isSubscribed() ? (
          <Button
            variant="outlined"
            disabled
            startIcon={<CheckCircleIcon />}
            color="success"
          >
            Abonné
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubscribe}
            startIcon={<AddIcon />}
          >
            S'abonner
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" color="primary.main">
                  {collector.nom}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Service de collecte de déchets
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" paragraph>
              {collector.description}
            </Typography>

            {/* Zones de couverture */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Zones de couverture
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {collector.zone_couverture?.split(',').map((zone, index) => (
                  <Chip
                    key={index}
                    label={zone.trim()}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Horaires */}
          {schedules.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Horaires de collecte
              </Typography>
              <List>
                {schedules.map((schedule, index) => (
                  <React.Fragment key={schedule.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${schedule.jour} - ${schedule.heure}`}
                        secondary={`${schedule.type_dechet} - Zone: ${schedule.zone}`}
                      />
                    </ListItem>
                    {index < schedules.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        {/* Informations de contact */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations de contact
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Téléphone"
                    secondary={collector.telephone || 'Non renseigné'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={collector.email || 'Non renseigné'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Adresse"
                    secondary={collector.adresse || 'Non renseignée'}
                  />
                </ListItem>
              </List>

              {collector.contact && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Contact supplémentaire
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {collector.contact}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de confirmation */}
      <Dialog
        open={confirmDialog}
        onClose={() => !subscribing && setConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmer l'abonnement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment vous abonner au collecteur{' '}
            <strong>{collector.nom}</strong> ?
          </DialogContentText>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              <strong>Zones :</strong> {collector.zone_couverture}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Contact :</strong> {collector.telephone}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog(false)} 
            disabled={subscribing}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmSubscription}
            variant="contained"
            disabled={subscribing}
            startIcon={subscribing ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {subscribing ? 'Abonnement...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CollectorDetailsPage;