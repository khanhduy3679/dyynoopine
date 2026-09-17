const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending_otp', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'expired'],
    default: 'pending_otp'
  },
  otpCode: String,
  otpExpiresAt: Date,
  otpAttempts: { type: Number, default: 0 },
  qrToken: { type: String, unique: true, sparse: true },
  checkedInAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
