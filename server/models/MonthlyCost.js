// models/MonthlyCost.js
// FRONTEND LINK: Used in AdminMessBills.tsx — stores per-month cost per day set by admin

const mongoose = require('mongoose');

const monthlyCostSchema = new mongoose.Schema({
  month: { type: Number, required: true },  // 1-12
  year: { type: Number, required: true },
  costPerDay: { type: Number, required: true, default: 120 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

monthlyCostSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyCost', monthlyCostSchema);
