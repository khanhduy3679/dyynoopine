require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const userRoutes = require('./routes/userRoutes');
const Appointment = require('./models/Appointment');
const seedInitialData = require('./config/seedData');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', catalogRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API running' }));

async function expirePendingAppointments() {
  await Appointment.updateMany({ status: 'pending_otp', otpExpiresAt: { $lt: new Date() } }, { status: 'expired' });
}
setInterval(expirePendingAppointments, 60 * 1000);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/salon_booking')
  .then(async () => {
    await seedInitialData();
    app.listen(PORT, () => console.log(`Backend chạy tại http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Không kết nối được MongoDB:', err.message));
