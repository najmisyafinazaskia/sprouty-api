const express = require('express');
const router = express.Router();
const wateringController = require('../controllers/wateringController');
const { deviceAuth } = require('../middleware/auth');

router.get('/', wateringController.list);
router.post('/close', deviceAuth, wateringController.close);

module.exports = router;
