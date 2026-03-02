// routes/authRoutes.js
// FRONTEND LINK: POST /api/auth/login  → Login.tsx
//                POST /api/auth/register → AdminManageUsers.tsx (Add User)

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', auth, adminOnly, register); // Only admins can create users

module.exports = router;
