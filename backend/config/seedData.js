const bcrypt = require('bcrypt');
const Service = require('../models/Service');
const User = require('../models/User');

async function seedInitialData() {
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { name: 'Cắt tóc nam/nữ', description: 'Tư vấn tạo kiểu và cắt tóc', duration: 45, price: 120000 },
      { name: 'Gội đầu dưỡng sinh', description: 'Gội, massage thư giãn', duration: 60, price: 180000 },
      { name: 'Nhuộm tóc', description: 'Nhuộm thời trang cơ bản', duration: 120, price: 650000 }
    ]);
  }

  const staffCount = await User.countDocuments({ role: 'staff' });
  if (staffCount === 0) {
    const services = await Service.find();
    const password = await bcrypt.hash('Staff@123', 10);
    await User.create({ fullName: 'Stylist Minh Anh', email: 'staff@salon.local', phone: '0900000001', password, role: 'staff', serviceIds: services.map((s) => s._id) });
  }

  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount === 0) {
    const password = await bcrypt.hash('Admin@123', 10);
    await User.create({ fullName: 'Quản trị viên', email: 'admin@salon.local', phone: '0900000000', password, role: 'admin' });
  }
}

module.exports = seedInitialData;
