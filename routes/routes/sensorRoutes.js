const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { deviceAuth } = require('../middleware/auth');

// ESP32 mengirim data ke sini. Sertakan header x-api-key kalau DEVICE_API_KEY diisi.
router.post('/readings', deviceAuth, sensorController.ingest);

router.get('/readings', sensorController.latest);
router.get('/history', sensorController.history);
router.get('/devices', sensorController.devices);

module.exports = router;
