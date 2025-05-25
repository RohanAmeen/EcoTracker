require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
  console.log('API route not found:', req.originalUrl);
  res.status(404).json({ error: 'API endpoint not found' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecotracker', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Connected to MongoDB');
  console.log('Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  // Don't expose internal errors to client
  const error = {
    message: 'Something went wrong!',
    status: err.status || 500
  };
  
  // Only send detailed error in development
  if (process.env.NODE_ENV === 'development') {
    error.details = err.message;
    error.stack = err.stack;
  }
  
  res.status(error.status).json({ error: error.message, details: error.details });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('API endpoints:');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/incidents');
  console.log('- POST /api/incidents');
}); 