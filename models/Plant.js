const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    moistureMin: { type: Number, default: 50, min: 0, max: 100 },
    moistureMax: { type: Number, default: 70, min: 0, max: 100 },
    deviceId: { type: String, default: '' },
    addedAt: { type: Date, default: Date.now },
    userId: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Plant', plantSchema);
