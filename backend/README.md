# 🏥 GLP-1 Patient Dashboard Backend

A comprehensive backend API for Acme Corp's GLP-1 weight-loss patient dashboard. Built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based user authentication with password hashing
- **📊 Dashboard Analytics**: Comprehensive overview with progress tracking
- **⚖️ Weight Tracking**: Record and analyze weight loss progress over time
- **📦 Shipment Monitoring**: Track medication shipments and delivery status
- **📈 Progress Charts**: Visual representation of weight loss journey
- **🔒 Data Privacy**: User-specific data access with proper authorization
- **📱 RESTful API**: Clean, documented API endpoints
- **🛡️ Input Validation**: Comprehensive data validation using Joi
- **🗄️ MongoDB Integration**: Scalable NoSQL database with Mongoose ODM

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Environment**: dotenv
- **CORS**: Cross-origin resource sharing enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd patient-dashboard/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### 4. Seed Sample Data (Optional)
```bash
npm run seed
```

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Include JWT token in requests:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### 🔐 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

#### 📈 Dashboard
- `GET /api/dashboard/overview` - Dashboard overview (Protected)

#### ⚖️ Weight Tracking
- `GET /api/weight` - Get weight entries (Protected)
- `POST /api/weight` - Add weight entry (Protected)
- `GET /api/weight/progress` - Progress chart data (Protected)
- `PUT /api/weight/:id` - Update weight entry (Protected)
- `DELETE /api/weight/:id` - Delete weight entry (Protected)

#### 📦 Shipments
- `GET /api/shipments` - Get user shipments (Protected)

For detailed API documentation, see [API_DOCS.md](./API_DOCS.md)

## 🧪 Testing

### Sample Test Accounts
After running the seed script, use these accounts:

**Account 1:**
- Email: `john.doe@example.com`
- Password: `password123`

**Account 2:**
- Email: `jane.smith@example.com`  
- Password: `password123`

### Example API Calls

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Get Dashboard Overview
```bash
curl -X GET http://localhost:5000/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Add Weight Entry
```bash
curl -X POST http://localhost:5000/api/weight \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "weight": 85.2,
    "notes": "Feeling great today!"
  }'
```

## 🗂️ Project Structure

```
backend/
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── dashboardController.js # Dashboard data
│   ├── patientController.js   # Legacy patient endpoints
│   ├── shipmentController.js  # Shipment management
│   └── weightController.js    # Weight tracking
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── errorHandler.js     # Error handling
│   ├── logger.js           # Request logging
│   └── validation.js       # Input validation
├── models/
│   ├── Patient.js          # Legacy patient model
│   ├── Shipment.js         # Shipment data model
│   ├── User.js             # User authentication model
│   └── WeightEntry.js      # Weight tracking model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── dashboard.js        # Dashboard routes
│   ├── patients.js         # Legacy patient routes
│   ├── shipments.js        # Shipment routes
│   └── weight.js           # Weight tracking routes
├── .env                    # Environment variables
├── API_DOCS.md            # Detailed API documentation
├── package.json           # Dependencies and scripts
├── README.md              # This file
├── seed.js                # Sample data seeder
└── server.js              # Main application file
```

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Populate database with sample data
- `npm test` - Run tests (placeholder)

## 🌱 Sample Data

The seed script creates:
- 2 test user accounts
- Realistic weight loss progress data
- Sample medication shipments
- BMI calculations and progress tracking

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Joi schema validation
- **Error Handling**: Comprehensive error responses
- **CORS Protection**: Cross-origin request handling

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### Recommended Deployment Platforms
- **AWS**: EC2, Lambda, or App Runner
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: App Platform or Droplets
- **Vercel**: Serverless functions

## 📈 Task Requirements Compliance

This backend API fully addresses the Acme Corp technical challenge requirements:

✅ **Secure User Authentication**: JWT-based login system  
✅ **Dashboard Overview**: Comprehensive landing page data  
✅ **Weight Loss Progress**: Historical data with charts and BMI  
✅ **Medication & Shipment Tracking**: Complete shipment lifecycle  
✅ **System Design**: Node.js/Express + MongoDB + JWT  
✅ **Working Prototype**: Functional API with sample data  
✅ **Documentation**: Complete API docs and setup instructions  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Acme Corp technical challenge.

## 📞 Support

For questions about the implementation or setup, please refer to the API documentation or create an issue.

---

**Built with ❤️ for Acme Corp's GLP-1 Patient Dashboard Challenge**
