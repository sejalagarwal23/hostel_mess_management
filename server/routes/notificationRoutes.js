// routes/notificationRoutes.js
// FRONTEND LINK: GET  /api/notifications → StudentNotifications.tsx
//                POST /api/notifications → AdminNotifications.tsx

const express = require('express');
const router = express.Router();
const { getAll, create } = require('../controllers/notificationController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, getAll);
router.post('/', auth, adminOnly, create);

module.exports = router;
