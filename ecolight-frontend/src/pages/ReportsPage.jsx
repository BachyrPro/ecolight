import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import reportService from '../services/report.service';

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    localisation: '',
    description: '',
    latitude: null,
    longitude: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getUserReports();
      setReports(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportData = new FormData();
      reportData.append('localisation', formData.localisation);
      reportData.append('description', formData.description);
      if (formData.latitude) reportData.append('latitude', formData.latitude);
      if (formData.longitude) reportData.append('longitude', formData.longitude);
      if (selectedImage) reportData.append('image', selectedImage);

      await reportService.createReport(reportData);
      setCreateDialog(false);
      resetForm();
      await loadReports();
    } catch (err) {
      setError('Erreur lors de la création du signalement');
    }
  };

  const resetForm = () => {
    setFormData({
      localisation: '',
      description: '',
      latitude: null,
      longitude: null,
    });
    setSelectedImage(null);
    setImagePreview('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'nouveau': return 'error';
      case 'en_cours': return 'warning';
      case 'resolu': return 'success';
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="primary.main">
          Mes signalements
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialog(true)}
        >
          Nouveau signalement
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {reports.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Aucun signalement pour le moment
              </Typography>
            </Paper>
          </Grid>
        ) : (
          reports.map((report) => (
            <Grid item xs={12} md={6} lg={4} key={report.id}>
              <Card>
                {report.image_url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${process.env.REACT_APP_API_URL || ''}${report.image_url}`}
                    alt="Photo du signalement"
                  />
                )}
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6" component="div">
                      {report.localisation}
                    </Typography>
                    <Chip
                      label={report.statut}
                      size="small"
                      color={getStatusColor(report.statut)}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {report.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(report.date_report).toLocaleDateString('fr-FR')}
                  </Typography>
                </CardContent>
                <CardActions>
                  {report.latitude && report.longitude && (
                    <Button
                      size="small"
                      startIcon={<LocationIcon />}
                      onClick={() => window.open(`https://maps.google.com/?q=${report.latitude},${report.longitude}`)}
                    >
                      Voir sur la carte
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Nouveau signalement
          <IconButton
            onClick={() => setCreateDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Localisation"
              name="localisation"
              value={formData.localisation}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
              margin="normal"
            />

            <Box display="flex" gap={2} my={2}>
              <Button
                variant="outlined"
                startIcon={<LocationIcon />}
                onClick={handleGetLocation}
              >
                Obtenir ma position
              </Button>
              {formData.latitude && (
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  Position obtenue ✓
                </Typography>
              )}
            </Box>

            <Box my={2}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageSelect}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                >
                  Ajouter une photo
                </Button>
              </label>
            </Box>

            {imagePreview && (
              <Box my={2}>
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}

            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button onClick={() => setCreateDialog(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="contained">
                Signaler
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setCreateDialog(true)}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default ReportsPage;