const router = require('express').Router();
const controller = require('../controllers/catalogController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/services', controller.getServices);
router.post('/services', authMiddleware, controller.createService);
router.put('/services/:id', authMiddleware, controller.updateService);
router.delete('/services/:id', authMiddleware, controller.deleteService);
router.get('/staff', controller.getStaff);

module.exports = router;
