import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import collectorService from '../services/collector.service';
import subscriptionService from '../services/subscription.service';

function CollectorsPage() {
  const navigate = useNavigate();
  const [collectors, setCollectors] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Chargement des données...');
      
      // Charger les collecteurs d'abord
      const collectorsData = await collectorService.getAllCollectors();
      console.log('✅ Collecteurs chargés:', collectorsData);
      setCollectors(collectorsData);
      
      // Charger les abonnements (peut échouer si pas authentifié)
      try {
        const subscriptionsData = await subscriptionService.getUserSubscriptions();
        console.log('✅ Abonnements chargés:', subscriptionsData);
        setUserSubscriptions(subscriptionsData);
      } catch (subError) {
        console.error('⚠️ Erreur lors du chargement des abonnements:', subError);
        // Ne pas afficher d'erreur, juste continuer sans abonnements
        setUserSubscriptions([]);
      }
      
    } catch (err) {
      console.error('💥 Erreur lors du chargement des collecteurs:', err);
      setError('Erreur lors du chargement des collecteurs');
      setCollectors([]);
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = (collectorId) => {
    return userSubscriptions.some(sub => {
      const subCollectorId = sub.collector_id || sub.id;
      return subCollectorId == collectorId;
    });
  };

  const handleViewDetails = (collectorId) => {
    navigate(`/collectors/${collectorId}`);
  };

  const filteredCollectors = collectors.filter(collector =>
    collector.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collector.zone_couverture?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>Chargement des collecteurs...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="primary.main">
          Collecteurs disponibles
        </Typography>
        <Button
          variant="outlined"
          onClick={loadData}
          startIcon={<RefreshIcon />}
          disabled={loading}
        >
          Actualiser
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par nom ou zone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Zone de couverture</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCollectors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="text.secondary">
                    {collectors.length === 0 ? 'Aucun collecteur disponible' : 'Aucun collecteur trouvé pour cette recherche'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCollectors.map((collector) => {
                const subscribed = isSubscribed(collector.id);
                
                return (
                  <TableRow key={collector.id} hover>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {collector.nom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {collector.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {collector.zone_couverture?.split(',').slice(0, 2).map((zone, index) => (
                          <Chip
                            key={index}
                            label={zone.trim()}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                        {collector.zone_couverture?.split(',').length > 2 && (
                          <Chip
                            label={`+${collector.zone_couverture.split(',').length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{collector.telephone}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {subscribed ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Abonné"
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Non abonné"
                          color="default"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(collector.id)}
                        title="Voir les détails"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default CollectorsPage;