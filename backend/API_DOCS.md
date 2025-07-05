# GLP-1 Patient Dashboard API Documentation

## Overview
This is a comprehensive API for a GLP-1 weight-loss patient dashboard built for Acme Corp. The API provides secure authentication, weight tracking, shipment monitoring, and dashboard analytics.

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 🔐 Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1985-06-15",
  "gender": "male",
  "height": 180,
  "targetWeight": 80
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "height": 180,
    "targetWeight": 80,
    "startDate": "2024-01-15T00:00:00.000Z"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "height": 180,
  "targetWeight": 75
}
```

### 📈 Dashboard

#### Get Dashboard Overview
```http
GET /dashboard/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "user@example.com",
      "startDate": "2024-01-15T00:00:00.000Z",
      "targetWeight": 80,
      "height": 180,
      "daysSinceStart": 142
    },
    "currentWeight": 85.2,
    "currentBMI": 26.3,
    "weightProgress": {
      "currentWeight": 85.2,
      "startWeight": 95.5,
      "targetWeight": 80,
      "weightLost": 10.3,
      "progressPercentage": 66,
      "remainingWeight": 5.2
    },
    "upcomingShipments": [...],
    "recentShipments": [...],
    "stats": {
      "totalWeightEntries": 24,
      "recentEntriesCount": 8,
      "totalShipments": 6,
      "pendingShipments": 1
    }
  }
}
```

### ⚖️ Weight Tracking

#### Get Weight Entries
```http
GET /weight?page=1&limit=20&startDate=2024-01-01&endDate=2024-06-01
Authorization: Bearer <token>
```

#### Add Weight Entry
```http
POST /weight
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "weight": 85.2,
  "notes": "Feeling great today!",
  "entryDate": "2024-06-05T10:30:00.000Z"
}
```

#### Get Weight Progress Chart
```http
GET /weight/progress?period=3months
Authorization: Bearer <token>
```

**Query Parameters:**
- `period`: `1month`, `3months`, `6months`, `1year`

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "3months",
    "chartData": [
      {
        "date": "2024-03-01T00:00:00.000Z",
        "weight": 95.5,
        "bmi": 29.5,
        "notes": "Starting weight"
      },
      ...
    ],
    "stats": {
      "currentWeight": 85.2,
      "startWeight": 95.5,
      "lowestWeight": 84.8,
      "highestWeight": 95.5,
      "totalWeightLoss": 10.3,
      "averageWeight": 89.2,
      "totalEntries": 24
    },
    "targetWeight": 80
  }
}
```

#### Update Weight Entry
```http
PUT /weight/:id
Authorization: Bearer <token>
```

#### Delete Weight Entry
```http
DELETE /weight/:id
Authorization: Bearer <token>
```

### 📦 Shipment Tracking

#### Get User Shipments
```http
GET /shipments?page=1&limit=10&status=delivered
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: `pending`, `shipped`, `in_transit`, `delivered`, `cancelled`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 6,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "_id": "shipment_id",
      "trackingNumber": "AC00000001",
      "status": "delivered",
      "medication": {
        "name": "Semaglutide",
        "type": "semaglutide",
        "dosage": "0.25mg",
        "quantity": 4,
        "unit": "pens"
      },
      "dates": {
        "orderDate": "2024-01-01T00:00:00.000Z",
        "shippedDate": "2024-01-03T00:00:00.000Z",
        "expectedDeliveryDate": "2024-01-06T00:00:00.000Z",
        "actualDeliveryDate": "2024-01-06T00:00:00.000Z"
      },
      "carrier": "FedEx",
      "cost": {
        "medication": 299.99,
        "shipping": 0,
        "total": 299.99
      }
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

## Sample Test Data

After running the seeder (`npm run seed`), you can use these test accounts:

**Account 1:**
- Email: `john.doe@example.com`
- Password: `password123`

**Account 2:**
- Email: `jane.smith@example.com`
- Password: `password123`

## Data Models

### User
- Personal information (name, email, phone, etc.)
- Physical attributes (height, target weight)
- Account settings and authentication

### Weight Entry
- Weight measurements over time
- BMI calculations
- Optional notes
- Entry dates

### Shipment
- Medication details and dosage
- Shipping information and tracking
- Delivery status and dates
- Cost breakdown

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation
- Error handling
- Data privacy (user-specific data access)
