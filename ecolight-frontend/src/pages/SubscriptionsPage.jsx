import React, { useState, useEffect } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import subscriptionService from '../services/subscription.service';

function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getUserSubscriptions();
      setSubscriptions(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des abonnements');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await subscriptionService.updateStatus(id, newStatus);
      await loadSubscriptions();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async () => {
    try {
      await subscriptionService.deleteSubscription(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      await loadSubscriptions();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'actif': return 'success';
      case 'inactif': return 'default';
      case 'suspendu': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" color="primary.main" mb={3}>
        Mes abonnements
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Collecteur</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Date d'abonnement</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Vous n'avez aucun abonnement actif
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow key={subscription.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {subscription.collector_nom}
                    </Typography>
                  </TableCell>
                  <TableCell>{subscription.collector_contact}</TableCell>
                  <TableCell>
                    {new Date(subscription.date_subscription).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={subscription.statut}
                      color={getStatusColor(subscription.statut)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      {subscription.statut === 'actif' ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          onClick={() => handleStatusChange(subscription.id, 'suspendu')}
                          startIcon={<CancelIcon />}
                        >
                          Suspendre
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleStatusChange(subscription.id, 'actif')}
                          startIcon={<CheckCircleIcon />}
                        >
                          Activer
                        </Button>
                      )}
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, id: subscription.id })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet abonnement ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SubscriptionsPage;