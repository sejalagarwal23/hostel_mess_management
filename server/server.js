// server.js — Entry point
// FRONTEND LINK: The React app makes API calls to http://localhost:5000/api/*
// Update VITE proxy or use CORS to allow frontend requests

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors()); // Allows requests from React frontend (default http://localhost:5173)
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
// FRONTEND LINK: Each route corresponds to frontend service calls in src/services/*
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
