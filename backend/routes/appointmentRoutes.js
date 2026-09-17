const router = require('express').Router();
const controller = require('../controllers/appointmentController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

router.post('/check-in', requireAuth, requireRole('staff', 'admin'), controller.checkIn);
router.get('/my', requireAuth, controller.getMyAppointments);
router.get('/', requireAuth, requireRole('staff', 'admin'), controller.getAppointments);
router.post('/', requireAuth, controller.createAppointment);
router.post('/:id/verify-otp', requireAuth, controller.verifyOtp);
router.post('/:id/resend-otp', requireAuth, controller.resendOtp);
router.patch('/:id/status', requireAuth, controller.updateStatus);

module.exports = router;
