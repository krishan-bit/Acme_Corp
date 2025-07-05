# Patient Dashboard - GLP-1 Weight Management Platform

A comprehensive healthcare management platform for GLP-1 weight management patients, featuring medication tracking, shipment monitoring, weight progress analytics, and secure user management.

![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Material-UI](https://img.shields.io/badge/Material--UI-7.2.0-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)

## 🌟 Features

- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **💊 Medication Management**: Track current medications, dosages, and prescriptions
- **📦 Shipment Tracking**: Real-time tracking of medication deliveries with status updates
- **📊 Weight Progress**: Visual analytics and goal tracking with interactive charts
- **👤 Profile Management**: Comprehensive health profile with BMI calculations
- **📈 Dashboard Analytics**: Overview of health metrics and trends
- **🎨 Modern UI**: Material-UI components with responsive design
- **🔒 Data Security**: HIPAA-compliant data handling and protection

## 🏗️ Architecture

```
Frontend (React)     Backend (Express)     Database (MongoDB)
     │                       │                      │
   Port 5174               Port 5000            Atlas Cloud
     │                       │                      │
     └─────── HTTP API ──────┴──── Mongoose ───────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd patient-dashboard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=your_mongodb_connection_string" > .env
   echo "JWT_SECRET=your_jwt_secret_key" >> .env
   echo "JWT_EXPIRE=7d" >> .env
   echo "NODE_ENV=development" >> .env
   echo "PORT=5000" >> .env
   
   # Start backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start frontend development server
   npm run dev
   ```

4. **Add Sample Data** (Optional)
   ```bash
   cd ../backend
   node scripts/addSampleData.js
   ```

### 🌐 Access the Application
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
patient-dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Dashboard/   # Main dashboard
│   │   │   ├── Login/       # Authentication
│   │   │   ├── Medications/ # Medication management
│   │   │   ├── Navigation/  # App navigation
│   │   │   ├── Profile/     # User profile
│   │   │   └── Progress/    # Weight tracking
│   │   ├── contexts/        # React contexts
│   │   └── style/          # Styling
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js backend API
│   ├── controllers/        # Business logic
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & logging
│   ├── config/            # Configuration
│   ├── scripts/           # Utility scripts
│   ├── package.json
│   └── server.js
├── SYSTEM_DESIGN.md        # Detailed system design
└── README.md              # This file
```

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |

### Medications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medications` | Get user medications |
| POST | `/api/medications` | Create new medication |
| PUT | `/api/medications/:id` | Update medication |
| DELETE | `/api/medications/:id` | Delete medication |

### Shipments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shipments` | Get user shipments |

### Weight Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weight` | Get weight entries |
| POST | `/api/weight` | Add weight entry |
| GET | `/api/weight/progress` | Get progress chart |
| PUT | `/api/weight/:id` | Update weight entry |
| DELETE | `/api/weight/:id` | Delete weight entry |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/overview` | Get dashboard overview |

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - UI framework
- **Material-UI 7.2.0** - Component library
- **React Router 7.6.3** - Client-side routing
- **Axios 1.10.0** - HTTP client
- **Recharts 3.0.2** - Data visualization
- **Vite 7.0.0** - Build tool

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js 4.x** - Web framework
- **MongoDB 6.x** - NoSQL database
- **Mongoose 8.x** - ODM for MongoDB
- **JSON Web Token** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **CORS Protection**: Controlled cross-origin requests
- **Route Protection**: Middleware authentication for protected routes
- **Environment Variables**: Secure configuration management

## 🎯 Key Features Showcase

### 1. Authentication System
- Secure login/registration
- JWT token management
- Protected route implementation
- User session persistence

### 2. Medication Management
- Current medication tracking
- Dosage and frequency monitoring
- Prescription management
- Medication status updates

### 3. Shipment Tracking
- Real-time delivery status
- Tracking number integration
- Delivery date estimates
- Shipment history

### 4. Weight Progress Analytics
- Visual weight tracking charts
- BMI calculations
- Goal setting and monitoring
- Progress trends analysis

### 5. User Profile Management
- Comprehensive health profiles
- Personal information management
- Emergency contact details
- Activity level tracking

## 📊 Sample Data

The application includes sample data for testing:

- **Test User**: `john.doe@example.com`
- **Sample Medications**: Semaglutide, Tirzepatide, Metformin
- **Sample Shipments**: Various tracking statuses
- **Sample Weight Entries**: Progress tracking data

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm start

# Frontend  
cd frontend && npm run dev
```

### Production (Recommended)
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: AWS EC2, Heroku, or DigitalOcean
- **Database**: MongoDB Atlas (managed cloud)

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=5000
```

## 📈 Performance Optimizations

- **Database Indexing**: Strategic indexes for query performance
- **Pagination**: Efficient data loading
- **Code Splitting**: React lazy loading
- **Bundle Optimization**: Vite tree-shaking
- **Connection Pooling**: MongoDB connection optimization

## 🧪 Testing

### Sample API Requests

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"password123"}'
```

**Get Medications** (with JWT token)
```bash
curl -X GET http://localhost:5000/api/medications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Developer**: [Your Name]  
**Email**: [your.email@example.com]  
**LinkedIn**: [Your LinkedIn Profile]  
**GitHub**: [Your GitHub Profile]

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- MongoDB Atlas for reliable database hosting
- React team for the amazing framework
- Express.js for the robust backend framework

---

## 🎯 For Recruiters

This project demonstrates:

- **Full-Stack Development**: Complete MERN stack implementation
- **Modern Technologies**: Latest versions of React, Node.js, MongoDB
- **Security Best Practices**: JWT authentication, input validation, password hashing
- **API Design**: RESTful endpoints with proper documentation
- **Database Design**: Efficient schema design with relationships
- **Frontend Architecture**: Component-based design with context state management
- **Performance Optimization**: Database indexing, efficient queries, frontend optimization
- **Code Organization**: Clean architecture and separation of concerns
- **Documentation**: Comprehensive system design and API documentation

**📋 Detailed System Design**: See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for comprehensive technical documentation.

---

*Built with ❤️ using modern web technologies*
