const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, enum: ['admin', 'staff', 'customer'] },
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
