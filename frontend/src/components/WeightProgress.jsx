import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const WeightProgress = () => {
  const [weightData, setWeightData] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchWeightProgress = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/weight/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWeightData(response.data.data.chartData.map(entry => ({
          date: entry.date.toISOString().split('T')[0],
          weight: entry.weight,
          bmi: entry.bmi
        })));
      } catch (error) {
        console.error('Error fetching weight progress:', error);
      }
    };
    if (token) fetchWeightProgress();
  }, [token]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Weight Progress</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weightData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} lbs`, 'Weight']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#2196f3" 
            activeDot={{ r: 8 }} 
            name="Weight (lbs)"
          />
          <Line 
            type="monotone" 
            dataKey="bmi" 
            stroke="#ff9800" 
            name="BMI"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WeightProgress;