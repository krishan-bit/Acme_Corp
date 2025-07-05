const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const patientRoutes = require('./routes/patients');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const weightRoutes = require('./routes/weight');
const shipmentRoutes = require('./routes/shipments');
const medicationRoutes = require('./routes/medications');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger); // Custom logging middleware

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Patient Dashboard Backend API is running with MongoDB!',
    version: '2.0.0',
    database: 'MongoDB',
    endpoints: {
      patients: '/api/patients',
      health: '/api/health'
    },
    features: [
      'CRUD operations for patients',
      'MongoDB integration',
      'Search by name',
      'Filter by status and condition',
      'Pagination support',
      'Input validation',
      'Error handling',
      'Data persistence'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'MongoDB Connected'
  });
});

// Use routes
app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/medications', medicationRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 GLP-1 Patient Dashboard API - Acme Corp`);
  console.log(`\n🔐 Authentication Endpoints:`);
  console.log(`   POST   /api/auth/register       - Register new user`);
  console.log(`   POST   /api/auth/login          - Login user`);
  console.log(`   GET    /api/auth/profile        - Get user profile (Protected)`);
  console.log(`   PUT    /api/auth/profile        - Update user profile (Protected)`);
  console.log(`\n📈 Dashboard Endpoints:`);
  console.log(`   GET    /api/dashboard/overview  - Get dashboard overview (Protected)`);
  console.log(`\n⚖️  Weight Tracking Endpoints:`);
  console.log(`   GET    /api/weight              - Get weight entries (Protected)`);
  console.log(`   POST   /api/weight              - Add weight entry (Protected)`);
  console.log(`   GET    /api/weight/progress     - Get weight progress chart (Protected)`);
  console.log(`   PUT    /api/weight/:id          - Update weight entry (Protected)`);
  console.log(`   DELETE /api/weight/:id          - Delete weight entry (Protected)`);
  console.log(`\n💊 Medication Endpoints:`);
  console.log(`   GET    /api/medications         - Get user medications (Protected)`);
  console.log(`   POST   /api/medications         - Create new medication (Protected)`);
  console.log(`   PUT    /api/medications/:id     - Update medication (Protected)`);
  console.log(`   DELETE /api/medications/:id     - Delete medication (Protected)`);
  console.log(`\n📦 Shipment Tracking Endpoints:`);
  console.log(`   GET    /api/shipments           - Get user shipments (Protected)`);
  console.log(`\n👨‍⚕️ Legacy Patient Endpoints:`);
  console.log(`   GET    /api/patients            - Get all patients`);
  console.log(`   POST   /api/patients            - Create new patient`);
  console.log(`\n💡 Examples:`);
  console.log(`   POST /api/auth/login with { "email": "user@example.com", "password": "password123" }`);
  console.log(`   GET  /api/dashboard/overview with Authorization: Bearer <token>`);
  console.log(`   GET  /api/weight/progress?period=3months with Authorization: Bearer <token>`);
  console.log(`\n💾 Database: MongoDB Atlas with Mongoose ODM`);
  console.log(`🔒 Authentication: JWT Token Based`);
});
