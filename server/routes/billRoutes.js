// routes/billRoutes.js
// FRONTEND LINK: GET  /api/bills/:userId        → StudentMessBill.tsx
//                PUT  /api/bills/monthly-cost    → AdminMessBills.tsx (save costs)
//                POST /api/bills/generate-monthly → AdminMessBills.tsx (generate)
const express = require('express');
const router = express.Router();

const { 
  getStudentBills, 
  saveMonthlyCosts, 
  generateMonthlyBills,
  getMonthlyCost            // add this
} = require('../controllers/billController');

const { auth, adminOnly } = require('../middleware/auth');

router.put('/monthly-cost', auth, adminOnly, saveMonthlyCosts);
router.get('/monthly-cost', auth, adminOnly, getMonthlyCost);   // 👈 ADD THIS
router.post('/generate-monthly', auth, adminOnly, generateMonthlyBills);

router.get("/student/:studentId", getStudentBills);

module.exports = router;