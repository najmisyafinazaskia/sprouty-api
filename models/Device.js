const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: 'ESP32' },
    plantId: { type: String, default: '' },
    lastSeen: { type: Date, default: Date.now },
    online: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Device', deviceSchema);
