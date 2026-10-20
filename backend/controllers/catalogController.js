const Service = require('../models/Service');
const User = require('../models/User');

exports.getServices = async (req, res) => {
  const services = await Service.find({}).sort({ name: 1 });
  res.json({ success: true, services });
};

exports.createService = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền tạo dịch vụ' });
    }
    const { name, description, duration, price } = req.body;
    if (!name || !duration || !price) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ tên, thời lượng và giá' });
    }
    const service = await Service.create({ name, description, duration, price, isActive: true });
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền cập nhật dịch vụ' });
    }
    const { name, description, duration, price, isActive } = req.body;
    const updateData = { name, description, duration, price, isActive };
    await Service.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa dịch vụ' });
    }
    await Service.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Đã ẩn dịch vụ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStaff = async (req, res) => {
  const staff = await User.find({ role: 'staff', isActive: true }).select('fullName email phone serviceIds').sort({ fullName: 1 });
  res.json({ success: true, staff: [{ _id: '', fullName: 'Bất kỳ stylist' }, ...staff] });
};
