import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import scheduleService from '../services/schedule.service';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getUserSchedules();
      setSchedules(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des horaires');
    } finally {
      setLoading(false);
    }
  };

  const groupSchedulesByDay = () => {
    const grouped = {};
    jours.forEach(jour => {
      grouped[jour] = schedules.filter(schedule => schedule.jour === jour);
    });
    return grouped;
  };

  const getTypeDechetColor = (type) => {
    if (type.includes('ménager')) return 'default';
    if (type.includes('recyclable')) return 'success';
    if (type.includes('organique')) return 'warning';
    return 'primary';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const groupedSchedules = groupSchedulesByDay();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" color="primary.main" mb={3}>
        Horaires de collecte
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {jours.map((jour) => {
          const daySchedules = groupedSchedules[jour] || [];
          const isToday = jour.toLowerCase() === new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();

          return (
            <Grid item xs={12} md={6} lg={4} key={jour}>
              <Card 
                elevation={isToday ? 4 : 1}
                sx={{ 
                  height: '100%',
                  border: isToday ? '2px solid' : 'none',
                  borderColor: 'primary.main'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={isToday ? 600 : 400}>
                      {jour}
                    </Typography>
                    {isToday && (
                      <Chip label="Aujourd'hui" color="primary" size="small" />
                    )}
                  </Box>

                  {daySchedules.length === 0 ? (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      Aucune collecte
                    </Typography>
                  ) : (
                    <List dense disablePadding>
                      {daySchedules.map((schedule, index) => (
                        <React.Fragment key={schedule.id}>
                          {index > 0 && <Divider sx={{ my: 1 }} />}
                          <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <ScheduleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="subtitle2">
                                    {schedule.heure}
                                  </Typography>
                                  <Chip 
                                    label={schedule.type_dechet} 
                                    size="small"
                                    color={getTypeDechetColor(schedule.type_dechet)}
                                    variant="outlined"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                  <LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {schedule.zone} - {schedule.collector}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paper sx={{ mt: 4, p: 3, backgroundColor: '#E8F5E9' }}>
        <Typography variant="h6" gutterBottom>
          Légende
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="Déchets ménagers" size="small" />
          <Chip label="Déchets recyclables" size="small" color="success" variant="outlined" />
          <Chip label="Déchets organiques" size="small" color="warning" variant="outlined" />
          <Chip label="Tous types" size="small" color="primary" variant="outlined" />
        </Box>
      </Paper>
    </Container>
  );
}

export default SchedulesPage;