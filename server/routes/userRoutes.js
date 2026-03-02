// routes/userRoutes.js
// FRONTEND LINK: GET /api/users → AdminManageUsers.tsx (getAllUsers)
//                GET /api/users/search?q= → search in AdminManageUsers / AdminLeave

const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, searchUsers } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAllUsers);
router.get('/search', auth, searchUsers);
router.get('/:id', auth, getUserById);

module.exports = router;
