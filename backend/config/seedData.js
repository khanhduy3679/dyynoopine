const bcrypt = require('bcrypt');
const Service = require('../models/Service');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Role = require('../models/Role');

async function seedRoles() {
  const roles = await require('../models/Role').countDocuments();
  if (roles === 0) {
    await require('../models/Role').insertMany([
      { name: 'admin', description: 'Quản trị viên toàn quyền' },
      { name: 'staff', description: 'Nhân viên giao dịch' },
      { name: 'customer', description: 'Khách hàng' }
    ]);
  }
}

async function seedInitialData() {
  await seedRoles();

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { name: 'Cắt tóc nam', description: 'Cắt tóc cơ bản cho nam', duration: 30, price: 80000, category: 'Cắt tóc', image: '' },
      { name: 'Cắt tóc nữ', description: 'Cắt tóc styling cho nữ', duration: 45, price: 120000, category: 'Cắt tóc', image: '' },
      { name: 'Gội đầu dưỡng sinh', description: 'Gội, massage đầu thư giãn', duration: 60, price: 180000, category: 'Chăm sóc', image: '' },
      { name: 'Nhuộm tóc', description: 'Nhuộm thời trang cơ bản', duration: 120, price: 650000, category: 'Tạo hình', image: '' },
      { name: 'Đuổi tóc', description: 'Xử lý chấy rận, côn trùng', duration: 30, price: 100000, category: 'Chăm sóc', image: '' },
      { name: 'Tạo kiểu tóc', description: 'Tạo kiểu tóc đi tiệc, dự tiệc', duration: 60, price: 250000, category: 'Tạo hình', image: '' },
      { name: 'Massage toàn thân', description: 'Massage thư giãn toàn thân 60 phút', duration: 60, price: 350000, category: 'Massage', image: '' },
      { name: 'Cạo gió', description: 'Cạo gió truyền thống', duration: 20, price: 50000, category: 'Chăm sóc', image: '' },
      { name: 'Gội dầu ', description: 'Gội đầu bằng dầu đặc trị', duration: 45, price: 150000, category: 'Chăm sóc', image: '' },
      { name: 'Tóc trẻ em', description: 'Cắt tóc cho trẻ em từ 3-12 tuổi', duration: 20, price: 50000, category: 'Cắt tóc', image: '' },
      { name: 'Hớt tóc', description: 'Hớt tóc ngắn, phân lớp tóc', duration: 15, price: 30000, category: 'Cắt tóc', image: '' },
      { name: 'Ép tóc', description: 'Ép tóc mượt mà, giảm xù', duration: 30, price: 100000, category: 'Chăm sóc', image: '' },
      { name: 'Làm mềm tóc', description: 'Xử lý tóc xù, làm mềm tóc', duration: 20, price: 80000, category: 'Chăm sóc', image: '' },
      { name: 'Tỏa lông mày', description: 'Tỏa lông mày, tạo dáng lông mày', duration: 15, price: 30000, category: 'Làm đẹp', image: '' },
      { name: 'Khâu tóc', description: 'Khâu tóc tạo kiểu, buộc tresse', duration: 30, price: 100000, category: 'Tạo hình', image: '' },
      { name: 'Móng tay', description: 'Sơn móng tay, thiết kế móng tay', duration: 30, price: 100000, category: 'Làm đẹp', image: '' },
      { name: 'Massage chân', description: 'Massage chân thư giãn 30 phút', duration: 30, price: 150000, category: 'Massage', image: '' }
    ]);
  }

  const staffCount = await User.countDocuments({ role: 'staff' });
  if (staffCount === 0) {
    const services = await Service.find();
    const password = await bcrypt.hash('Staff@123', 10);
    await User.create([{
      fullName: 'Trần Thị Minh Anh',
      email: 'staff@salon.local',
      phone: '0900000001',
      password,
      role: 'staff',
      serviceIds: services.slice(0, 5).map(s => s._id),
      specialties: ['Cắt tóc nữ', 'Tạo kiểu tóc']
    }, {
      fullName: 'Ngô Văn Bình',
      email: 'staff2@salon.local',
      phone: '0900000002',
      password,
      role: 'staff',
      serviceIds: services.slice(3, 8).map(s => s._id),
      specialties: ['Nhuộm tóc', 'Tạo kiểu tóc']
    }, {
      fullName: 'Lê Thị Thu Hà',
      email: 'staff3@salon.local',
      phone: '0900000003',
      password,
      role: 'staff',
      serviceIds: services.slice(5, 10).map(s => s._id),
      specialties: ['Massage', 'Chăm sóc tóc']
    }]);
  }

  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount === 0) {
    const password = await bcrypt.hash('Admin@123', 10);
    await User.create({ fullName: 'Quản trị viên', email: 'admin@salon.local', phone: '0900000000', password, role: 'admin' });
  }

  const customerCount = await User.countDocuments({ role: 'customer' });
  if (customerCount === 0) {
    const password = await bcrypt.hash('User@123', 10);
    await User.insertMany([
      { fullName: 'Phạm Thị Lan', email: 'lan@salon.local', phone: '0901111222', password, role: 'customer' },
      { fullName: 'Hoàng Văn Nam', email: 'nam@salon.local', phone: '0902222333', password, role: 'customer' },
      { fullName: 'Đặng Thị Hương', email: 'huong@salon.local', phone: '0903333444', password, role: 'customer' },
      { fullName: 'Võ Minh Khoa', email: 'khoa@salon.local', phone: '0904444555', password, role: 'customer' },
      { fullName: 'Bùi Thị Nga', email: 'nga@salon.local', phone: '0905555666', password, role: 'customer' }
    ]);
  }

  const paymentCount = await Payment.countDocuments();
  if (paymentCount === 0) {
    await Payment.insertMany([
      { customerId: null, staffId: null, amount: 250000, method: 'cash', status: 'completed', note: 'Trả tiền trực tiếp' },
      { customerId: null, staffId: null, amount: 350000, method: 'card', status: 'completed', note: 'Thanh toán thẻ' },
      { customerId: null, staffId: null, amount: 150000, method: 'transfer', status: 'pending', note: 'Chờ xác nhận chuyển khoản' },
      { customerId: null, staffId: null, amount: 500000, method: 'momopay', status: 'completed', note: 'Thanh toán qua MoMo' },
      { customerId: null, staffId: null, amount: 200000, method: 'cash', status: 'cancelled', note: 'Hủy đơn' }
    ]);
  }

  console.log('[Seed] Initial data seeded successfully');
}

module.exports = seedInitialData;
