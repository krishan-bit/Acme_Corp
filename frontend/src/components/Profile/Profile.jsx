import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  Height,
  FitnessCenter,
  CalendarToday,
  PhotoCamera
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: '',
    medicalConditions: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [originalData, setOriginalData] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data;
      setProfileData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        height: data.height || '',
        currentWeight: data.currentWeight || '',
        targetWeight: data.targetWeight || '',
        activityLevel: data.activityLevel || '',
        medicalConditions: data.medicalConditions || '',
        emergencyContact: {
          name: data.emergencyContact?.name || '',
          phone: data.emergencyContact?.phone || '',
          relationship: data.emergencyContact?.relationship || ''
        }
      });
      setOriginalData({ ...data });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...profileData });
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.put('http://localhost:5000/api/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.data) {
        updateUser(response.data.data);
      }
      
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Not specified';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    const weight = parseFloat(profileData.currentWeight);
    const height = parseFloat(profileData.height);
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return 'N/A';
  };

  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'info' };
    if (bmiValue < 25) return { category: 'Normal', color: 'success' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'error' };
  };

  if (loading && !isEditing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Profile
        </Typography>
        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Activity Level"
                    value={profileData.activityLevel}
                    onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    select={isEditing}
                    SelectProps={isEditing ? { native: true } : {}}
                  >
                    {isEditing && (
                      <>
                        <option value="">Select Activity Level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="lightly_active">Lightly Active</option>
                        <option value="moderately_active">Moderately Active</option>
                        <option value="very_active">Very Active</option>
                        <option value="extremely_active">Extremely Active</option>
                      </>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medical Conditions"
                    value={profileData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    multiline
                    rows={2}
                    placeholder="List any medical conditions, allergies, or important health information"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
              >
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6">
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Age: {calculateAge(profileData.dateOfBirth)}
              </Typography>
              <Chip 
                label={profileData.activityLevel ? profileData.activityLevel.replace('_', ' ') : 'Not specified'} 
                size="small" 
                variant="outlined"
              />
            </CardContent>
          </Card>

          {/* Health Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Health Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={profileData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{
                      startAdornment: <Height sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Weight (kg)"
                    type="number"
                    value={profileData.currentWeight}
                    onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    InputProps={{
                      startAdornment: <FitnessCenter sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Target Weight (kg)"
                    type="number"
                    value={profileData.targetWeight}
                    onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                  />
                </Grid>
              </Grid>

              {profileData.height && profileData.currentWeight && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {bmi}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      BMI
                    </Typography>
                    <Chip 
                      label={bmiInfo.category} 
                      color={bmiInfo.color} 
                      size="small" 
                      sx={{ mt: 1 }} 
                    />
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Emergency Contact
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={profileData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Relationship"
                    value={profileData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'standard'}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
