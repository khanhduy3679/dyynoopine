const Appointment = require('../models/Appointment');
const service = require('../services/appointmentService');

const handle = (res, err) => res.status(err.status || 500).json({ success: false, message: err.message, attemptsLeft: err.attemptsLeft });

exports.createAppointment = async (req, res) => {
  try {
    const { appointment, demoOtp } = await service.createAppointment({ customer: req.user, ...req.body });
    res.status(201).json({ success: true, appointmentId: appointment._id, status: appointment.status, otpExpiresAt: appointment.otpExpiresAt, demoOtp });
  } catch (err) { handle(res, err); }
};

exports.verifyOtp = async (req, res) => {
  try {
    const appt = await service.verifyOtp(req.params.id, req.body.otp);
    res.json({ success: true, status: appt.status, qrToken: appt.qrToken });
  } catch (err) { handle(res, err); }
};

exports.resendOtp = async (req, res) => {
  try {
    const { appointment, demoOtp } = await service.resendOtp(req.params.id);
    res.json({ success: true, otpExpiresAt: appointment.otpExpiresAt, demoOtp });
  } catch (err) { handle(res, err); }
};

exports.checkIn = async (req, res) => {
  try {
    const appt = await service.checkIn(req.body.qrToken);
    res.json({ success: true, appointment: { customerName: appt.customerId?.fullName, serviceName: appt.serviceId?.name, startTime: appt.startTime, status: appt.status } });
  } catch (err) { handle(res, err); }
};

exports.updateStatus = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    const isOwner = String(appt.customerId) === String(req.user.id || req.user._id);
    const nextStatus = req.body.status;

    // Kiểm soát quyền theo trạng thái đích
    if (nextStatus === 'cancelled') {
      // Chỉ chủ lịch hẹn hoặc admin mới được hủy
      if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Không có quyền hủy lịch' });
    } else if (['checked_in', 'in_progress', 'completed'].includes(nextStatus)) {
      // Chỉ staff hoặc admin mới được chuyển sang các trạng thái vận hành
      if (req.user.role !== 'staff' && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Chỉ nhân viên hoặc admin mới có quyền thực hiện thao tác này' });
    }

    const updated = await service.changeStatus(appt, nextStatus);
    res.json({ success: true, appointment: updated });
  } catch (err) { handle(res, err); }
};

exports.getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ customerId: req.user.id || req.user._id }).populate('serviceId staffId').sort({ startTime: -1 });
  res.json({ success: true, appointments });
};

exports.getAppointments = async (req, res) => {
  const query = {};
  if (req.query.staffId) query.staffId = req.query.staffId;
  if (req.query.status) query.status = req.query.status;
  if (req.query.date) { const d = new Date(req.query.date); query.startTime = { $gte: d, $lt: new Date(d.getTime() + 86400000) }; }
  const appointments = await Appointment.find(query).populate('customerId serviceId staffId').sort({ startTime: 1 });
  res.json({ success: true, appointments });
};
