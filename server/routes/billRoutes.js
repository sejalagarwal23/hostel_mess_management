// routes/billRoutes.js
// FRONTEND LINK: GET  /api/bills/:userId        → StudentMessBill.tsx
//                PUT  /api/bills/monthly-cost    → AdminMessBills.tsx (save costs)
//                POST /api/bills/generate-monthly → AdminMessBills.tsx (generate)

const express = require('express');
const router = express.Router();
const { getBillsByUser, saveMonthlyCosts, generateMonthlyBills } = require('../controllers/billController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/:userId', auth, getBillsByUser);
router.put('/monthly-cost', auth, adminOnly, saveMonthlyCosts);
router.post('/generate-monthly', auth, adminOnly, generateMonthlyBills);

module.exports = router;
