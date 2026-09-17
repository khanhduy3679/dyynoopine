const Service = require('../models/Service');
const User = require('../models/User');

exports.getServices = async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, services });
};

exports.getStaff = async (req, res) => {
  const staff = await User.find({ role: 'staff', isActive: true }).select('fullName email phone serviceIds').sort({ fullName: 1 });
  res.json({ success: true, staff: [{ _id: '', fullName: 'Bất kỳ stylist' }, ...staff] });
};
