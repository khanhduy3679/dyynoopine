const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const stateMachine = require('./patterns/appointmentState');
const events = require('./patterns/appointmentEvents');
const buildBookingValidationChain = require('./patterns/bookingValidationChain');
const { createOtpStrategy } = require('./patterns/otpStrategies');

const Service = require('../models/Service');
const User = require('../models/User');

async function findService(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Service.findById(id);
}
async function findStaff(id) {
  if (!id) return null;
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findOne({ _id: id, role: 'staff', isActive: true });
}

async function createAppointment({ customer, serviceId, staffId, startTime }) {
  const service = await findService(serviceId);
  const staff = await findStaff(staffId);
  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) throw Object.assign(new Error('Thời gian đặt lịch không hợp lệ'), { status: 400 });
  const end = new Date(start.getTime() + (service?.duration || 45) * 60000);
  await buildBookingValidationChain().handle({ service, staff, staffId, startTime: start, endTime: end });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpCode = await bcrypt.hash(otp, 10);
  const otpMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 5);
  const appointment = await Appointment.create({ customerId: customer.id || customer._id, staffId: staff?._id || null, serviceId, startTime: start, endTime: end, otpCode, otpExpiresAt: new Date(Date.now() + otpMinutes * 60000), status: 'pending_otp' });
  await createOtpStrategy().sendOtp(customer.email || customer.phone, otp);
  return { appointment, demoOtp: process.env.NODE_ENV === 'production' ? undefined : otp };
}

async function verifyOtp(id, otp) {
  const appt = await Appointment.findById(id);
  if (!appt || appt.status !== 'pending_otp') throw Object.assign(new Error('Mã OTP không đúng hoặc đã hết hạn'), { status: 400 });
  if (appt.otpExpiresAt < new Date()) { await changeStatus(appt, 'expired'); throw Object.assign(new Error('Mã OTP không đúng hoặc đã hết hạn'), { status: 400 }); }
  const ok = await bcrypt.compare(otp, appt.otpCode || '');
  if (!ok) {
    appt.otpAttempts += 1;
    if (appt.otpAttempts >= 3) await changeStatus(appt, 'expired'); else await appt.save();
    throw Object.assign(new Error('Mã OTP không đúng hoặc đã hết hạn'), { status: 400, attemptsLeft: Math.max(0, 3 - appt.otpAttempts) });
  }
  appt.qrToken = crypto.randomBytes(24).toString('hex');
  await changeStatus(appt, 'confirmed');
  return appt;
}

async function changeStatus(appt, nextStatus) {
  const from = appt.status;
  stateMachine.assertTransition(from, nextStatus);
  appt.status = nextStatus;
  await appt.save();
  events.emit('statusChanged', { appointmentId: appt._id, from, to: nextStatus });
  return appt;
}

async function checkIn(qrToken) {
  const appt = await Appointment.findOne({ qrToken }).populate('customerId serviceId');
  if (!appt || appt.status !== 'confirmed') throw Object.assign(new Error('Mã QR không hợp lệ hoặc đã được sử dụng'), { status: 404 });
  const now = Date.now();
  const start = new Date(appt.startTime).getTime();
  if (now < start - 60 * 60000) throw Object.assign(new Error('Chưa đến thời gian check-in'), { status: 400 });
  if (now > start + 120 * 60000) throw Object.assign(new Error('Đã quá thời gian check-in'), { status: 400 });
  appt.checkedInAt = new Date();
  await changeStatus(appt, 'checked_in');
  return appt;
}

module.exports = { createAppointment, verifyOtp, checkIn, changeStatus };
