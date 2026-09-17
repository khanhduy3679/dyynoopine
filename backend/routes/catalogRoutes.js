const router = require('express').Router();
const controller = require('../controllers/catalogController');

router.get('/services', controller.getServices);
router.get('/staff', controller.getStaff);

module.exports = router;
