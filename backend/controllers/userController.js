const User = require('../models/User');
const bcrypt = require('bcrypt');

// Helper: Xử lý lỗi chung
const handle = (res, err) => res.status(err.status || 500).json({ success: false, message: err.message });

// === KHÁCH HÀNG (CUSTOMERS) ===

exports.getCustomers = async (req, res) => {
  try {
    // Chỉ admin/staff mới được xem danh sách
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) { handle(res, err); }
};

exports.createCustomer = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền tạo khách hàng' });
    }
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !phone) return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ họ tên và SĐT' });
    
    // Nếu có email thì kiểm tra trùng
    if (email) {
      const existed = await User.findOne({ email: email.toLowerCase() });
      if (existed) return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const hashed = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('default123', 10);
    await User.create({ fullName, email: email || '', phone, password: hashed, role: 'customer' });
    res.status(201).json({ success: true, message: 'Thêm khách hàng thành công' });
  } catch (err) { handle(res, err); }
};

exports.updateCustomer = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền cập nhật' });
    }
    const { fullName, email, phone, isActive } = req.body;
    const updateData = { fullName, phone, isActive };
    if (email) updateData.email = email.toLowerCase();
    
    await User.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) { handle(res, err); }
};

exports.deleteCustomer = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa' });
    }
    // Soft delete: khóa tài khoản thay vì xóa hẳn
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Đã khóa tài khoản khách hàng' });
  } catch (err) { handle(res, err); }
};

// === NHÂN VIÊN (STAFF) ===

exports.getStaff = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }
    const staffList = await User.find({ role: { $in: ['staff', 'admin'] } }).select('-password').sort({ fullName: 1 });
    res.json({ success: true, staff: staffList });
  } catch (err) { handle(res, err); }
};

exports.createStaff = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Chỉ admin mới được tạo nhân viên' });
    }
    const { fullName, email, phone, password, role } = req.body;
    if (!fullName || !phone || !email) return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    
    const existed = await User.findOne({ email: email.toLowerCase() });
    if (existed) return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });

    const hashed = await bcrypt.hash(password || 'staff123', 10);
    await User.create({ fullName, email: email.toLowerCase(), phone, password: hashed, role: role || 'staff' });
    res.status(201).json({ success: true, message: 'Thêm nhân viên thành công' });
  } catch (err) { handle(res, err); }
};

exports.updateStaff = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Chỉ admin mới được cập nhật nhân viên' });
    }
    const { fullName, email, phone, role, isActive } = req.body;
    const updateData = { fullName, phone, role, isActive };
    if (email) updateData.email = email.toLowerCase();
    
    await User.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) { handle(res, err); }
};

exports.deleteStaff = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Chỉ admin mới được xóa nhân viên' });
    }
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Đã khóa tài khoản nhân viên' });
  } catch (err) { handle(res, err); }
};