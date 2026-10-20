const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'card', 'transfer', 'momopay'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  note: String,
  paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
