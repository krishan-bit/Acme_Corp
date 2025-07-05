import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Schedule,
  Medication,
  Info,
  Refresh,
  Timeline
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const Medications = () => {
  const { user, token } = useContext(AuthContext);
  const [medications, setMedications] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMedicationData();
  }, []);

  const fetchMedicationData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch current medications
      const medicationsResponse = await axios.get('http://localhost:5000/api/medications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch shipments
      const shipmentsResponse = await axios.get('http://localhost:5000/api/shipments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMedications(medicationsResponse.data.medications || []);
      setShipments(shipmentsResponse.data.data || []);
    } catch (err) {
      console.error('Error fetching medication data:', err);
      setError('Failed to load medication data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMedicationData();
    setRefreshing(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getShipmentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'in_transit':
        return 'primary';
      case 'processing':
        return 'warning';
      case 'delayed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getShipmentIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle />;
      case 'in_transit':
        return <LocalShipping />;
      case 'processing':
        return <Schedule />;
      default:
        return <LocalShipping />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrentMedications = () => {
    return medications.filter(med => med.status === 'active');
  };

  const getUpcomingShipments = () => {
    return shipments.filter(shipment => 
      shipment.status !== 'delivered' && 
      new Date(shipment.dates?.expectedDeliveryDate) >= new Date()
    ).sort((a, b) => new Date(a.dates?.expectedDeliveryDate) - new Date(b.dates?.expectedDeliveryDate));
  };

  const getRecentShipments = () => {
    return shipments.filter(shipment => 
      shipment.status === 'delivered' || 
      new Date(shipment.dates?.expectedDeliveryDate) < new Date()
    ).sort((a, b) => new Date(b.dates?.actualDeliveryDate || b.dates?.expectedDeliveryDate) - new Date(a.dates?.actualDeliveryDate || a.dates?.expectedDeliveryDate));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Medications & Shipments
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Current Medications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Medication sx={{ mr: 1 }} />
            Current Medications
          </Typography>
          
          {getCurrentMedications().length === 0 ? (
            <Typography color="text.secondary">No active medications</Typography>
          ) : (
            <Grid container spacing={2}>
              {getCurrentMedications().map((medication) => (
                <Grid item xs={12} md={6} key={medication._id}>
                  <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" component="h3">
                      {medication.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {medication.dosage} • {medication.frequency}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {medication.instructions}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={medication.type} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`${medication.remainingDays} days left`} 
                        size="small" 
                        color={medication.remainingDays <= 7 ? 'warning' : 'default'}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Shipments Tabs */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Upcoming Shipments" />
              <Tab label="Recent Shipments" />
            </Tabs>
          </Box>

          {/* Upcoming Shipments */}
          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Timeline sx={{ mr: 1 }} />
                Upcoming Shipments
              </Typography>
              
              {getUpcomingShipments().length === 0 ? (
                <Typography color="text.secondary">No upcoming shipments</Typography>
              ) : (
                <List>
                  {getUpcomingShipments().map((shipment, index) => (
                    <React.Fragment key={shipment._id}>
                      <ListItem>
                        <ListItemIcon>
                          {getShipmentIcon(shipment.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">
                                {shipment.medication?.name}
                              </Typography>
                              <Chip 
                                label={shipment.status.replace('_', ' ')} 
                                size="small" 
                                color={getShipmentStatusColor(shipment.status)}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Expected: {formatDate(shipment.dates?.expectedDeliveryDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Tracking: {shipment.trackingNumber}
                              </Typography>
                              {shipment.notes && (
                                <Typography variant="body2" color="text.secondary">
                                  {shipment.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Tooltip title="View details">
                          <IconButton size="small">
                            <Info />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      {index < getUpcomingShipments().length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Recent Shipments */}
          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 1 }} />
                Recent Shipments
              </Typography>
              
              {getRecentShipments().length === 0 ? (
                <Typography color="text.secondary">No recent shipments</Typography>
              ) : (
                <List>
                  {getRecentShipments().slice(0, 10).map((shipment, index) => (
                    <React.Fragment key={shipment._id}>
                      <ListItem>
                        <ListItemIcon>
                          {getShipmentIcon(shipment.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">
                                {shipment.medication?.name}
                              </Typography>
                              <Chip 
                                label={shipment.status.replace('_', ' ')} 
                                size="small" 
                                color={getShipmentStatusColor(shipment.status)}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {shipment.status === 'delivered' ? 'Delivered' : 'Expected'}: {formatDate(shipment.dates?.actualDeliveryDate || shipment.dates?.expectedDeliveryDate)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Tracking: {shipment.trackingNumber}
                              </Typography>
                            </Box>
                          }
                        />
                        <Tooltip title="View details">
                          <IconButton size="small">
                            <Info />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      {index < getRecentShipments().slice(0, 10).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Medications;
