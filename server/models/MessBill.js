// models/MessBill.js
// FRONTEND LINK: Maps to MessBill in src/lib/store.ts
// Used in AdminMessBills.tsx and StudentMessBill.tsx

const mongoose = require('mongoose');

const messBillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },       // 1-12
  year: { type: Number, required: true },
  totalDaysPresent: { type: Number, default: 0 },
  costPerDay: { type: Number, default: 120 },     // Set monthly by admin
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

messBillSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MessBill', messBillSchema);
