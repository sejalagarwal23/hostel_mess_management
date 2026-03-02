// routes/leaveRoutes.js
// FRONTEND LINK: POST /api/leave          → AdminLeave.tsx (assign leave)
//                GET  /api/leave/:userId   → view student leaves

const express = require('express');
const router = express.Router();
const { assignLeave, getLeavesByUser } = require('../controllers/leaveController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, adminOnly, assignLeave);
router.get('/:userId', auth, getLeavesByUser);

module.exports = router;
