const mongoose = require('mongoose');

const wateringLogSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    plantId: { type: String, default: '', index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    durationSec: { type: Number, default: 0 },
    moistureBefore: { type: Number, default: null },
    reason: { type: String, default: 'auto' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('WateringLog', wateringLogSchema);
