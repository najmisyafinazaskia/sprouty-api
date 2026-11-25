const WateringLog = require('../models/WateringLog');

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.deviceId) filter.deviceId = req.query.deviceId;
    if (req.query.plantId) filter.plantId = req.query.plantId;

    const batas = Math.min(Number(req.query.limit) || 30, 200);
    const data = await WateringLog.find(filter).sort({ startedAt: -1 }).limit(batas);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Dipanggil ESP32 kalau pompa selesai menyiram: POST /api/watering/close
exports.close = async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) return res.status(400).json({ message: 'deviceId wajib diisi.' });

    const log = await WateringLog.findOneAndUpdate(
      { deviceId, endedAt: null },
      { $set: { endedAt: new Date() } },
      { new: true },
    ).sort({ startedAt: -1 });

    if (!log) return res.json({ message: 'Tidak ada penyiraman yang aktif.', log: null });

    log.durationSec = Math.round((log.endedAt - log.startedAt) / 1000);
    await log.save();
    return res.json({ message: 'Riwayat penyiraman ditutup.', log });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
