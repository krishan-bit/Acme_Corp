import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import PatientManagement from './PatientManagement';
import WeightProgress from './WeightProgress';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPatients: 0, activeCases: 0, recentUpdates: 0 });
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data.data;
        setStats({
          totalPatients: data.stats.totalWeightEntries,
          activeCases: data.stats.recentEntriesCount,
          recentUpdates: data.stats.pendingShipments
        });
      } catch (error) {
        console.error('Error fetching dashboard overview:', error);
      }
    };
    if (token) fetchDashboardOverview();
  }, [token]);

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" gutterBottom>Welcome to Patient Dashboard</Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <div className="stat-card"><Typography>Total Patients: {stats.totalPatients}</Typography></div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className="stat-card"><Typography>Active Cases: {stats.activeCases}</Typography></div>
        </Grid>
        <Grid item xs={12} md={4}>
          <div className="stat-card"><Typography>Recent Updates: {stats.recentUpdates}</Typography></div>
        </Grid>
      </Grid>
      <PatientManagement />
      <WeightProgress />
    </Box>
  );
};

export default Dashboard;