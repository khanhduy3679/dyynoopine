/**
 * Mock data for Salon Booking App (Ngọc Hair Salon)
 * Dùng cho frontend demo và seed data cho backend MongoDB
 */

export const mockUser = {
  id: 'u1',
  name: 'Nguyễn Văn An',
  email: 'admin@ngochairsalon.vn',
  role: 'admin',
  roleLabel: 'Quản trị viên',
  phone: '0901234567',
};

export const mockCustomers = [
  { id: 'c1', name: 'Nguyễn Thị Lan', phone: '0901234567', email: 'lan.nguyen@gmail.com', gender: 'female', birthday: '1990-05-14', address: '12 Lê Lợi, Q.1, TP.HCM', totalVisits: 28, totalSpent: 4200000, lastVisit: '2026-09-20', createdAt: '2024-03-10' },
  { id: 'c2', name: 'Trần Văn Minh', phone: '0912345678', email: 'minh.tran@gmail.com', gender: 'male', birthday: '1985-11-22', totalVisits: 12, totalSpent: 1450000, lastVisit: '2026-09-18', createdAt: '2024-06-15' },
  { id: 'c3', name: 'Lê Thị Hoa', phone: '0923456789', gender: 'female', birthday: '1995-07-08', totalVisits: 5, totalSpent: 620000, lastVisit: '2026-09-10', createdAt: '2025-01-20' },
  { id: 'c4', name: 'Phạm Văn Đức', phone: '0934567890', gender: 'male', totalVisits: 8, totalSpent: 680000, lastVisit: '2026-09-15', createdAt: '2024-09-01' },
  { id: 'c5', name: 'Hoàng Thị Mai', phone: '0945678901', email: 'mai.hoang@gmail.com', gender: 'female', birthday: '1988-03-30', address: '45 Nguyễn Huệ, Q.1', totalVisits: 22, totalSpent: 3800000, lastVisit: '2026-09-22', createdAt: '2024-01-05' },
  { id: 'c6', name: 'Vũ Thanh Tùng', phone: '0956789012', gender: 'male', birthday: '1992-09-17', totalVisits: 3, totalSpent: 240000, lastVisit: '2026-08-30', createdAt: '2026-07-12' },
  { id: 'c7', name: 'Đặng Thị Thúy', phone: '0967890123', email: 'thuy.dang@gmail.com', gender: 'female', totalVisits: 15, totalSpent: 2100000, lastVisit: '2026-09-19', createdAt: '2024-11-18' },
  { id: 'c8', name: 'Bùi Văn Hải', phone: '0978901234', gender: 'male', totalVisits: 9, totalSpent: 750000, lastVisit: '2026-09-12', createdAt: '2025-03-07' },
  { id: 'c9', name: 'Đỗ Thị Nga', phone: '0989012345', email: 'nga.do@gmail.com', gender: 'female', birthday: '1998-12-25', totalVisits: 6, totalSpent: 890000, lastVisit: '2026-09-21', createdAt: '2025-06-14' },
  { id: 'c10', name: 'Ngô Văn Khoa', phone: '0990123456', gender: 'male', totalVisits: 2, totalSpent: 160000, lastVisit: '2026-09-05', createdAt: '2026-08-20' },
  { id: 'c11', name: 'Phan Thị Linh', phone: '0901122334', gender: 'female', birthday: '1993-06-18', totalVisits: 18, totalSpent: 2650000, lastVisit: '2026-09-23', createdAt: '2024-04-02' },
  { id: 'c12', name: 'Đinh Văn Long', phone: '0912233445', gender: 'male', totalVisits: 7, totalSpent: 560000, lastVisit: '2026-09-16', createdAt: '2025-05-22' },
];

export const mockStaff = [
  { id: 's1', name: 'Nguyễn Văn An', phone: '0901111111', email: 'an@ngochairsalon.vn', role: 'Thợ cắt tóc chính', specialties: ['Cắt tóc nam', 'Fade', 'Undercut', 'Barber'], workDays: [1,2,3,4,5,6], startTime: '08:00', endTime: '18:00', rating: 4.9, totalServices: 256, active: true },
  { id: 's2', name: 'Trần Thị Minh', phone: '0902222222', email: 'minh@ngochairsalon.vn', role: 'Chuyên gia nhuộm & uốn', specialties: ['Nhuộm tóc', 'Uốn xoăn', 'Ombre', 'Highlight', 'Balayage'], workDays: [1,2,3,4,5,6], startTime: '08:00', endTime: '18:00', rating: 4.8, totalServices: 180, active: true },
  { id: 's3', name: 'Lê Văn Hùng', phone: '0903333333', role: 'Thợ cắt tóc', specialties: ['Cắt tóc nam', 'Cắt tóc nữ', 'Tạo kiểu'], workDays: [2,3,4,5,6,0], startTime: '09:00', endTime: '19:00', rating: 4.6, totalServices: 145, active: true },
  { id: 's4', name: 'Phạm Thị Thu', phone: '0904444444', email: 'thu@ngochairsalon.vn', role: 'Chuyên viên chăm sóc', specialties: ['Gội đầu', 'Ủ tóc', 'Phục hồi tóc', 'Massage da đầu'], workDays: [1,3,4,5,6,0], startTime: '08:00', endTime: '17:00', rating: 4.7, totalServices: 198, active: true },
  { id: 's5', name: 'Hoàng Văn Nam', phone: '0905555555', role: 'Thợ uốn & tạo kiểu', specialties: ['Uốn lơi', 'Duỗi tóc', 'Tạo kiểu sự kiện'], workDays: [1,2,4,5,6,0], startTime: '08:30', endTime: '18:30', rating: 4.5, totalServices: 120, active: true },
];

export const mockServices = [
  { id: 'sv1', name: 'Cắt tóc nam', category: 'Cắt tóc', duration: 30, price: 80000, description: 'Cắt tóc nam tạo kiểu cơ bản', active: true },
  { id: 'sv2', name: 'Cắt tóc nữ', category: 'Cắt tóc', duration: 45, price: 120000, description: 'Cắt tóc nữ tạo kiểu', active: true },
  { id: 'sv3', name: 'Cắt tóc trẻ em', category: 'Cắt tóc', duration: 20, price: 60000, description: 'Dành cho trẻ em dưới 12 tuổi', active: true },
  { id: 'sv4', name: 'Fade / Undercut', category: 'Cắt tóc', duration: 45, price: 120000, description: 'Kỹ thuật Fade và Undercut chuyên nghiệp', active: true },
  { id: 'sv5', name: 'Gội đầu thường', category: 'Gội đầu', duration: 20, price: 50000, description: 'Gội đầu + sấy khô', active: true },
  { id: 'sv6', name: 'Gội đầu dưỡng sinh', category: 'Gội đầu', duration: 40, price: 120000, description: 'Gội đầu + massage da đầu + dưỡng tóc', active: true },
  { id: 'sv7', name: 'Gội đầu phục hồi', category: 'Gội đầu', duration: 45, price: 150000, description: 'Gội đầu + ủ phục hồi chuyên sâu', active: true },
  { id: 'sv8', name: 'Nhuộm màu thời trang', category: 'Nhuộm tóc', duration: 90, price: 350000, description: 'Nhuộm một màu thời trang theo xu hướng', active: true },
  { id: 'sv9', name: 'Nhuộm phủ bạc', category: 'Nhuộm tóc', duration: 60, price: 250000, description: 'Nhuộm phủ bạc tóc bền màu', active: true },
  { id: 'sv10', name: 'Highlight / Ombre', category: 'Nhuộm tóc', duration: 120, price: 500000, description: 'Highlight đa màu hoặc kỹ thuật Ombre/Balayage', active: true },
  { id: 'sv11', name: 'Uốn xoăn', category: 'Uốn & Duỗi', duration: 120, price: 450000, description: 'Uốn xoăn bằng hóa chất hoặc nhiệt', active: true },
  { id: 'sv12', name: 'Duỗi / Thẳng tóc', category: 'Uốn & Duỗi', duration: 120, price: 500000, description: 'Duỗi tóc Keratin hoặc Collagen', active: true },
  { id: 'sv13', name: 'Uốn lơi Hàn Quốc', category: 'Uốn & Duỗi', duration: 90, price: 380000, description: 'Uốn lơi tạo sóng tự nhiên phong cách Hàn Quốc', active: true },
  { id: 'sv14', name: 'Phục hồi tóc hư tổn', category: 'Chăm sóc', duration: 60, price: 200000, description: 'Ủ phục hồi chuyên sâu cho tóc hư tổn', active: true },
  { id: 'sv15', name: 'Ủ tóc Collagen', category: 'Chăm sóc', duration: 45, price: 250000, description: 'Ủ tóc Collagen tăng độ bóng và mềm mượt', active: true },
  { id: 'sv16', name: 'Massage da đầu', category: 'Chăm sóc', duration: 30, price: 100000, description: 'Massage giảm stress và kích thích mọc tóc', active: true },
  { id: 'sv17', name: 'Nhuộm tóc Keratin', category: 'Nhuộm tóc', duration: 150, price: 700000, description: 'Kết hợp nhuộm và xử lý Keratin', active: false },
];

export const mockAppointments = [
  { id: 'a1', customerId: 'c1', customerName: 'Nguyễn Thị Lan', customerPhone: '0901234567', staffId: 's2', staffName: 'Trần Thị Minh', services: [{ id: 'sv10', name: 'Highlight / Ombre', price: 500000 }, { id: 'sv7', name: 'Gội đầu phục hồi', price: 150000 }], date: '2026-09-25', time: '09:00', duration: 165, status: 'confirmed', totalPrice: 650000, createdAt: '2026-09-23' },
  { id: 'a2', customerId: 'c5', customerName: 'Hoàng Thị Mai', customerPhone: '0945678901', staffId: 's1', staffName: 'Nguyễn Văn An', services: [{ id: 'sv2', name: 'Cắt tóc nữ', price: 120000 }, { id: 'sv6', name: 'Gội đầu dưỡng sinh', price: 120000 }], date: '2026-09-25', time: '10:00', duration: 85, status: 'in-progress', totalPrice: 240000, createdAt: '2026-09-24' },
  { id: 'a3', customerId: 'c2', customerName: 'Trần Văn Minh', customerPhone: '0912345678', staffId: 's1', staffName: 'Nguyễn Văn An', services: [{ id: 'sv4', name: 'Fade / Undercut', price: 120000 }], date: '2026-09-25', time: '11:30', duration: 45, status: 'confirmed', totalPrice: 120000, createdAt: '2026-09-24' },
  { id: 'a4', customerId: 'c9', customerName: 'Đỗ Thị Nga', customerPhone: '0989012345', staffId: 's4', staffName: 'Phạm Thị Thu', services: [{ id: 'sv15', name: 'Ủ tóc Collagen', price: 250000 }, { id: 'sv16', name: 'Massage da đầu', price: 100000 }], date: '2026-09-25', time: '13:00', duration: 75, status: 'pending', totalPrice: 350000, createdAt: '2026-09-25' },
  { id: 'a5', customerId: 'c7', customerName: 'Đặng Thị Thúy', customerPhone: '0967890123', staffId: 's5', staffName: 'Hoàng Văn Nam', services: [{ id: 'sv13', name: 'Uốn lơi Hàn Quốc', price: 380000 }], date: '2026-09-25', time: '14:00', duration: 90, status: 'confirmed', totalPrice: 380000, createdAt: '2026-09-24' },
  { id: 'a6', customerId: 'c4', customerName: 'Phạm Văn Đức', customerPhone: '0934567890', staffId: 's3', staffName: 'Lê Văn Hùng', services: [{ id: 'sv1', name: 'Cắt tóc nam', price: 80000 }], date: '2026-09-25', time: '15:30', duration: 30, status: 'pending', totalPrice: 80000, createdAt: '2026-09-25' },
  { id: 'a7', customerId: 'c11', customerName: 'Phan Thị Linh', customerPhone: '0901122334', staffId: 's2', staffName: 'Trần Thị Minh', services: [{ id: 'sv8', name: 'Nhuộm màu thời trang', price: 350000 }, { id: 'sv14', name: 'Phục hồi tóc hư tổn', price: 200000 }], date: '2026-09-25', time: '16:00', duration: 150, status: 'confirmed', totalPrice: 550000, createdAt: '2026-09-23' },
  { id: 'a8', customerId: 'c3', customerName: 'Lê Thị Hoa', customerPhone: '0923456789', staffId: 's1', staffName: 'Nguyễn Văn An', services: [{ id: 'sv2', name: 'Cắt tóc nữ', price: 120000 }], date: '2026-09-24', time: '09:30', duration: 45, status: 'completed', totalPrice: 120000, createdAt: '2026-09-23' },
  { id: 'a9', customerId: 'c8', customerName: 'Bùi Văn Hải', customerPhone: '0978901234', staffId: 's3', staffName: 'Lê Văn Hùng', services: [{ id: 'sv1', name: 'Cắt tóc nam', price: 80000 }, { id: 'sv5', name: 'Gội đầu thường', price: 50000 }], date: '2026-09-24', time: '11:00', duration: 50, status: 'completed', totalPrice: 130000, createdAt: '2026-09-24' },
  { id: 'a10', customerId: 'c6', customerName: 'Vũ Thanh Tùng', customerPhone: '0956789012', staffId: 's1', staffName: 'Nguyễn Văn An', services: [{ id: 'sv4', name: 'Fade / Undercut', price: 120000 }], date: '2026-09-24', time: '14:30', duration: 45, status: 'cancelled', totalPrice: 120000, notes: 'Khách hủy vì bận việc', createdAt: '2026-09-23' },
  { id: 'a11', customerId: 'c12', customerName: 'Đinh Văn Long', customerPhone: '0912233445', staffId: 's5', staffName: 'Hoàng Văn Nam', services: [{ id: 'sv12', name: 'Duỗi / Thẳng tóc', price: 500000 }], date: '2026-09-24', time: '10:00', duration: 120, status: 'completed', totalPrice: 500000, createdAt: '2026-09-23' },
];

export const mockPayments = [
  { id: 'p1', appointmentId: 'a8', customerName: 'Lê Thị Hoa', staffName: 'Nguyễn Văn An', services: ['Cắt tóc nữ'], amount: 120000, discount: 0, finalAmount: 120000, method: 'cash', status: 'completed', date: '2026-09-24', time: '10:20' },
  { id: 'p2', appointmentId: 'a9', customerName: 'Bùi Văn Hải', staffName: 'Lê Văn Hùng', services: ['Cắt tóc nam', 'Gội đầu thường'], amount: 130000, discount: 0, finalAmount: 130000, method: 'cash', status: 'completed', date: '2026-09-24', time: '11:55' },
  { id: 'p3', appointmentId: 'a11', customerName: 'Đinh Văn Long', staffName: 'Hoàng Văn Nam', services: ['Duỗi / Thẳng tóc'], amount: 500000, discount: 50000, finalAmount: 450000, method: 'transfer', status: 'completed', date: '2026-09-24', time: '12:10' },
  { id: 'p4', appointmentId: 'a2', customerName: 'Hoàng Thị Mai', staffName: 'Nguyễn Văn An', services: ['Cắt tóc nữ', 'Gội đầu dưỡng sinh'], amount: 240000, discount: 0, finalAmount: 240000, method: 'momo', status: 'completed', date: '2026-09-25', time: '11:30' },
  { id: 'p5', appointmentId: 'a1', customerName: 'Nguyễn Thị Lan', staffName: 'Trần Thị Minh', services: ['Highlight / Ombre', 'Gội đầu phục hồi'], amount: 650000, discount: 65000, finalAmount: 585000, method: 'card', status: 'pending', date: '2026-09-25', time: '' },
];

export const mockNotifications = [
  { id: 'n1', type: 'appointment', title: 'Lịch hẹn mới', message: 'Nguyễn Thị Lan đã đặt lịch Highlight / Ombre lúc 09:00 ngày 25/09', read: false, createdAt: '2026-09-23T14:30:00' },
  { id: 'n2', type: 'appointment', title: 'Nhắc nhở lịch hẹn', message: 'Lịch hẹn của Trần Văn Minh lúc 11:30 hôm nay chưa được xác nhận', read: false, createdAt: '2026-09-25T08:00:00' },
  { id: 'n3', type: 'review', title: 'Đánh giá mới ⭐⭐⭐⭐⭐', message: 'Phan Thị Linh vừa để lại đánh giá 5 sao cho dịch vụ nhuộm tóc', read: false, createdAt: '2026-09-24T18:45:00' },
  { id: 'n4', type: 'payment', title: 'Thanh toán hoàn tất', message: 'Đinh Văn Long đã thanh toán 450.000đ qua chuyển khoản', read: true, createdAt: '2026-09-24T12:15:00' },
  { id: 'n5', type: 'system', title: 'Báo cáo tuần', message: 'Doanh thu tuần này đạt 8.750.000đ, tăng 12% so với tuần trước', read: true, createdAt: '2026-09-22T09:00:00' },
  { id: 'n6', type: 'appointment', title: 'Lịch hẹn bị hủy', message: 'Vũ Thanh Tùng đã hủy lịch hẹn lúc 14:30 ngày 24/09', read: true, createdAt: '2026-09-24T13:00:00' },
  { id: 'n7', type: 'system', title: 'Cập nhật hệ thống', message: 'Phần mềm đã được cập nhật lên phiên bản mới nhất với tính năng báo cáo nâng cao', read: true, createdAt: '2026-09-20T08:00:00' },
];

export const mockReviews = [
  { id: 'r1', customerId: 'c11', customerName: 'Phan Thị Linh', staffId: 's2', staffName: 'Trần Thị Minh', appointmentId: 'a7', rating: 5, comment: 'Màu tóc rất đẹp, chị Minh làm tỉ mỉ và chuyên nghiệp. Tóc mềm mại và bóng mượt. Nhất định sẽ quay lại!', services: ['Nhuộm màu thời trang'], date: '2026-09-24' },
  { id: 'r2', customerId: 'c1', customerName: 'Nguyễn Thị Lan', staffId: 's2', staffName: 'Trần Thị Minh', appointmentId: 'a1', rating: 5, comment: 'Ombre rất đẹp và tự nhiên! Chị Minh có tay nghề cao, tư vấn màu sắc rất tốt.', services: ['Highlight / Ombre', 'Gội đầu phục hồi'], date: '2026-09-20', reply: 'Cảm ơn chị Lan đã tin tưởng! Mong gặp lại chị ở lần sau nhé 😊' },
  { id: 'r3', customerId: 'c5', customerName: 'Hoàng Thị Mai', staffId: 's1', staffName: 'Nguyễn Văn An', appointmentId: 'a2', rating: 5, comment: 'Anh An cắt rất đẹp và đúng ý, tóc vào form lắm. Gội đầu cũng thơm và sạch. Rất hài lòng!', services: ['Cắt tóc nữ', 'Gội đầu dưỡng sinh'], date: '2026-09-22' },
  { id: 'r4', customerId: 'c8', customerName: 'Bùi Văn Hải', staffId: 's3', staffName: 'Lê Văn Hùng', appointmentId: 'a9', rating: 4, comment: 'Cắt tóc ổn, không gian sạch sẽ. Chờ hơi lâu một chút nhưng kết quả hài lòng.', services: ['Cắt tóc nam'], date: '2026-09-24' },
  { id: 'r5', customerId: 'c12', customerName: 'Đinh Văn Long', staffId: 's5', staffName: 'Hoàng Văn Nam', appointmentId: 'a11', rating: 4, comment: 'Duỗi tóc đẹp, nhân viên nhiệt tình. Giá cả hợp lý.', services: ['Duỗi / Thẳng tóc'], date: '2026-09-24' },
  { id: 'r6', customerId: 'c2', customerName: 'Trần Văn Minh', staffId: 's1', staffName: 'Nguyễn Văn An', appointmentId: '', rating: 5, comment: 'Anh An là thợ cắt tóc xịn nhất mà mình từng gặp. Mỗi lần đến là một lần hài lòng!', services: ['Fade / Undercut'], date: '2026-09-18' },
];

export const mockRoles = [
  {
    id: 'role1', name: 'Quản trị viên', description: 'Toàn quyền truy cập và quản lý hệ thống',
    permissions: [
      { module: 'customers', moduleLabel: 'Khách hàng', view: true, create: true, edit: true, delete: true },
      { module: 'staff', moduleLabel: 'Nhân viên', view: true, create: true, edit: true, delete: true },
      { module: 'services', moduleLabel: 'Dịch vụ', view: true, create: true, edit: true, delete: true },
      { module: 'appointments', moduleLabel: 'Lịch hẹn', view: true, create: true, edit: true, delete: true },
      { module: 'payments', moduleLabel: 'Thanh toán', view: true, create: true, edit: true, delete: true },
      { module: 'reports', moduleLabel: 'Báo cáo', view: true, create: false, edit: false, delete: false },
      { module: 'access', moduleLabel: 'Phân quyền', view: true, create: true, edit: true, delete: true },
    ],
  },
  {
    id: 'role2', name: 'Quản lý', description: 'Quản lý nhân sự, dịch vụ và xem báo cáo',
    permissions: [
      { module: 'customers', moduleLabel: 'Khách hàng', view: true, create: true, edit: true, delete: false },
      { module: 'staff', moduleLabel: 'Nhân viên', view: true, create: true, edit: true, delete: false },
      { module: 'services', moduleLabel: 'Dịch vụ', view: true, create: true, edit: true, delete: false },
      { module: 'appointments', moduleLabel: 'Lịch hẹn', view: true, create: true, edit: true, delete: false },
      { module: 'payments', moduleLabel: 'Thanh toán', view: true, create: true, edit: false, delete: false },
      { module: 'reports', moduleLabel: 'Báo cáo', view: true, create: false, edit: false, delete: false },
      { module: 'access', moduleLabel: 'Phân quyền', view: true, create: false, edit: false, delete: false },
    ],
  },
  {
    id: 'role3', name: 'Nhân viên', description: 'Thực hiện dịch vụ, xem lịch cá nhân',
    permissions: [
      { module: 'customers', moduleLabel: 'Khách hàng', view: true, create: false, edit: false, delete: false },
      { module: 'staff', moduleLabel: 'Nhân viên', view: false, create: false, edit: false, delete: false },
      { module: 'services', moduleLabel: 'Dịch vụ', view: true, create: false, edit: false, delete: false },
      { module: 'appointments', moduleLabel: 'Lịch hẹn', view: true, create: false, edit: true, delete: false },
      { module: 'payments', moduleLabel: 'Thanh toán', view: false, create: false, edit: false, delete: false },
      { module: 'reports', moduleLabel: 'Báo cáo', view: false, create: false, edit: false, delete: false },
      { module: 'access', moduleLabel: 'Phân quyền', view: false, create: false, edit: false, delete: false },
    ],
  },
  {
    id: 'role4', name: 'Lễ tân', description: 'Tiếp nhận, đặt lịch và xử lý thanh toán',
    permissions: [
      { module: 'customers', moduleLabel: 'Khách hàng', view: true, create: true, edit: true, delete: false },
      { module: 'staff', moduleLabel: 'Nhân viên', view: true, create: false, edit: false, delete: false },
      { module: 'services', moduleLabel: 'Dịch vụ', view: true, create: false, edit: false, delete: false },
      { module: 'appointments', moduleLabel: 'Lịch hẹn', view: true, create: true, edit: true, delete: false },
      { module: 'payments', moduleLabel: 'Thanh toán', view: true, create: true, edit: false, delete: false },
      { module: 'reports', moduleLabel: 'Báo cáo', view: false, create: false, edit: false, delete: false },
      { module: 'access', moduleLabel: 'Phân quyền', view: false, create: false, edit: false, delete: false },
    ],
  },
];

export const revenueData = [
  { month: 'T4', revenue: 32500000 },
  { month: 'T5', revenue: 38200000 },
  { month: 'T6', revenue: 35800000 },
  { month: 'T7', revenue: 41000000 },
  { month: 'T8', revenue: 44500000 },
  { month: 'T9', revenue: 28750000 },
];
