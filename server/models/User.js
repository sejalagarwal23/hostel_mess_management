// models/User.js
// FRONTEND LINK: Maps to User interface in src/lib/store.ts

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed with bcryptjs
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  phone: { type: String, required: true },
  email: { type: String },
  hostelNumber: { type: String },
  semester: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
