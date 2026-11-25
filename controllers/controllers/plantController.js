const Plant = require('../models/Plant');
const SensorReading = require('../models/SensorReading');
const WateringLog = require('../models/WateringLog');

exports.list = async (_req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    return res.json(plants);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const plant = await Plant.create(req.body);
    return res.status(201).json(plant);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Tanaman tidak ditemukan.' });
    return res.json(plant);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plant) return res.status(404).json({ message: 'Tanaman tidak ditemukan.' });
    return res.json(plant);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Tanaman tidak ditemukan.' });

    await SensorReading.deleteMany({ plantId: plant._id.toString() });
    await WateringLog.deleteMany({ plantId: plant._id.toString() });

    return res.json({ message: 'Tanaman dan riwayatnya dihapus.', id: plant._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.readings = async (req, res) => {
  try {
    const batas = Math.min(Number(req.query.limit) || 50, 500);
    const data = await SensorReading.find({ plantId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(batas);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
