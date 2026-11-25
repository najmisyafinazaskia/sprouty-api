const Device = require('../models/Device');
const SensorReading = require('../models/SensorReading');
const WateringLog = require('../models/WateringLog');

// Dipanggil ESP32: POST /api/sensor/readings
exports.ingest = async (req, res) => {
  try {
    const { deviceId, plantId = '', moisture, temperature = null, pumpStatus = false } = req.body;

    if (!deviceId || moisture === undefined) {
      return res.status(400).json({ message: 'deviceId dan moisture wajib diisi.' });
    }

    const lembap = Number(moisture);
    if (!Number.isFinite(lembap) || lembap < 0 || lembap > 100) {
      return res.status(400).json({ message: 'moisture harus angka 0-100.' });
    }

    const dev = await Device.findOneAndUpdate(
      { deviceId },
      { $set: { lastSeen: new Date(), online: true, ...(plantId ? { plantId } : {}) } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const reading = await SensorReading.create({
      deviceId,
      plantId: plantId || dev.plantId || '',
      moisture: lembap,
      temperature: temperature === null ? null : Number(temperature),
      pumpStatus: Boolean(pumpStatus),
    });

    // Catat riwayat penyiraman otomatis: buka saat ON, tutup saat OFF.
    const logAktif = await WateringLog.findOne({ deviceId, endedAt: null });
    if (pumpStatus && !logAktif) {
      await WateringLog.create({ deviceId, plantId: reading.plantId, moistureBefore: lembap, reason: 'auto' });
    } else if (!pumpStatus && logAktif) {
      logAktif.endedAt = new Date();
      logAktif.durationSec = Math.round((logAktif.endedAt - logAktif.startedAt) / 1000);
      await logAktif.save();
    }

    return res.status(201).json({ message: 'Data sensor tersimpan.', reading });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.latest = async (req, res) => {
  try {
    const filter = {};
    if (req.query.deviceId) filter.deviceId = req.query.deviceId;
    if (req.query.plantId) filter.plantId = req.query.plantId;

    const reading = await SensorReading.findOne(filter).sort({ createdAt: -1 });
    if (!reading) return res.json(null);
    return res.json(reading);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.history = async (req, res) => {
  try {
    const filter = {};
    if (req.query.deviceId) filter.deviceId = req.query.deviceId;
    if (req.query.plantId) filter.plantId = req.query.plantId;

    const batas = Math.min(Number(req.query.limit) || 50, 500);
    const data = await SensorReading.find(filter).sort({ createdAt: -1 }).limit(batas);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.devices = async (_req, res) => {
  try {
    const data = await Device.find().sort({ lastSeen: -1 });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
