const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    plantId: { type: String, default: '', index: true },
    moisture: { type: Number, required: true, min: 0, max: 100 },
    temperature: { type: Number, default: null },
    pumpStatus: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

sensorReadingSchema.index({ deviceId: 1, createdAt: -1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
