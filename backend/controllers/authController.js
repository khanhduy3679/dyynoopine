const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) => jwt.sign(
  { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
  process.env.JWT_SECRET || 'dev_secret',
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

const toClientUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role
});

exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !phone || !password) return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
    const existed = await User.findOne({ email: email.toLowerCase() });
    if (existed) return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, phone, password: hashed, role: 'customer' });
    res.status(201).json({ success: true, message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase(), isActive: true });
    if (!user) return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
    const ok = await bcrypt.compare(password || '', user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu' });
    res.json({ success: true, token: signToken(user), user: toClientUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
