import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Progress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('3months');
  const { user } = useAuth();

  useEffect(() => {
    fetchProgressData();
  }, [period]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/weight/progress?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProgressData(response.data);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError(err.response?.data?.message || 'Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatWeight = (weight) => {
    return `${weight} lbs`;
  };

  const getProgressColor = (value) => {
    if (value > 0) return '#4caf50'; // Green for positive progress
    if (value < 0) return '#f44336'; // Red for negative progress
    return '#ff9800'; // Orange for no change
  };

  const getWeightTrend = (data) => {
    if (!data || data.length < 2) return 'stable';
    const recent = data.slice(-2);
    const change = recent[1].weight - recent[0].weight;
    if (change > 0) return 'increasing';
    if (change < 0) return 'decreasing';
    return 'stable';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const chartData = progressData?.chartData?.map(entry => ({
    ...entry,
    date: formatDate(entry.date),
    weight: parseFloat(entry.weight),
    bmi: parseFloat(entry.bmi)
  })) || [];

  const stats = progressData?.stats || {};
  const trend = getWeightTrend(chartData);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Weight Progress
      </Typography>
      
      {/* Period Selection */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={period}
            label="Time Period"
            onChange={handlePeriodChange}
          >
            <MenuItem value="1month">Last Month</MenuItem>
            <MenuItem value="3months">Last 3 Months</MenuItem>
            <MenuItem value="6months">Last 6 Months</MenuItem>
            <MenuItem value="1year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Current Weight
              </Typography>
              <Typography variant="h4" component="div">
                {formatWeight(stats.currentWeight || 0)}
              </Typography>
              <Typography color="textSecondary">
                BMI: {stats.currentBMI || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Starting Weight
              </Typography>
              <Typography variant="h4" component="div">
                {formatWeight(stats.startWeight || 0)}
              </Typography>
              <Typography color="textSecondary">
                BMI: {stats.startBMI || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Total Weight Loss
              </Typography>
              <Typography 
                variant="h4" 
                component="div"
                sx={{ color: getProgressColor(stats.totalWeightLoss || 0) }}
              >
                {stats.totalWeightLoss > 0 ? '-' : ''}{Math.abs(stats.totalWeightLoss || 0)} lbs
              </Typography>
              <Chip 
                label={trend}
                size="small"
                color={trend === 'decreasing' ? 'success' : trend === 'increasing' ? 'error' : 'default'}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Average Loss/Week
              </Typography>
              <Typography variant="h4" component="div">
                {stats.avgWeightLossPerWeek || 0} lbs
              </Typography>
              <Typography color="textSecondary">
                Progress Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weight Progress Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Weight Progress Over Time
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'weight') return [formatWeight(value), 'Weight'];
                if (name === 'bmi') return [value.toFixed(1), 'BMI'];
                return [value, name];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#2196f3" 
              strokeWidth={3}
              name="Weight"
              dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="bmi" 
              stroke="#ff9800" 
              strokeWidth={2}
              name="BMI"
              dot={{ fill: '#ff9800', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* BMI Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          BMI Progression
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value.toFixed(1), 'BMI']}
            />
            <Bar 
              dataKey="bmi" 
              fill="#ff9800"
              name="BMI"
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Recent Entries */}
      {chartData.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Weight Entries
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {chartData.slice(-5).reverse().map((entry, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography variant="body1" fontWeight="bold">
                    {entry.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body1">
                    Weight: {formatWeight(entry.weight)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body1">
                    BMI: {entry.bmi.toFixed(1)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  {entry.notes && (
                    <Typography variant="body2" color="textSecondary">
                      {entry.notes}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default Progress;
