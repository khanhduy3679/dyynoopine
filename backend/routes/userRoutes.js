const router = require('express').Router();
const controller = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin/Staff: Lấy danh sách khách hàng
router.get('/customers', authMiddleware, controller.getCustomers);
// Admin/Staff: Tạo khách hàng mới
router.post('/customers', authMiddleware, controller.createCustomer);
// Admin/Staff: Cập nhật thông tin khách hàng
router.put('/customers/:id', authMiddleware, controller.updateCustomer);
// Admin/Staff: Xóa/khóa khách hàng
router.delete('/customers/:id', authMiddleware, controller.deleteCustomer);

// Admin: Lấy danh sách nhân viên
router.get('/staff', authMiddleware, controller.getStaff);
// Admin: Tạo nhân viên mới
router.post('/staff', authMiddleware, controller.createStaff);
// Admin: Cập nhật thông tin nhân viên
router.put('/staff/:id', authMiddleware, controller.updateStaff);
// Admin: Xóa/khóa nhân viên
router.delete('/staff/:id', authMiddleware, controller.deleteStaff);

module.exports = router;