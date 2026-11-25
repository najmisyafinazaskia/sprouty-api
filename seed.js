require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Plant = require('./models/Plant');
const Device = require('./models/Device');
const SensorReading = require('./models/SensorReading');
const WateringLog = require('./models/WateringLog');

async function seed() {
  await connectDB();

  await Promise.all([
    Plant.deleteMany({}),
    Device.deleteMany({}),
    SensorReading.deleteMany({}),
    WateringLog.deleteMany({}),
  ]);

  const chili = await Plant.create({
    name: 'My Chili Plant',
    species: 'Chili',
    photoUrl: '',
    moistureMin: 50,
    moistureMax: 70,
    deviceId: 'ESP32_001',
    addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    active: true,
  });

  const tomato = await Plant.create({
    name: 'Tomato Buddy',
    species: 'Tomato',
    photoUrl: '',
    moistureMin: 55,
    moistureMax: 75,
    deviceId: 'ESP32_002',
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    active: true,
  });

  await Device.create([
    { deviceId: 'ESP32_001', name: 'Pot Chili', plantId: chili._id.toString(), online: true },
    { deviceId: 'ESP32_002', name: 'Pot Tomato', plantId: tomato._id.toString(), online: false },
  ]);

  const sekarang = Date.now();
  const pola = [64, 63, 62, 61, 60, 59, 58, 65, 66, 67, 68, 65, 65, 64, 63, 62, 61, 60, 59, 65];

  const bacaan = [];
  pola.forEach((lembap, index) => {
    bacaan.push({
      deviceId: 'ESP32_001',
      plantId: chili._id.toString(),
      moisture: lembap,
      temperature: 27 + (index % 3),
      pumpStatus: false,
      createdAt: new Date(sekarang - (pola.length - index) * 10 * 60 * 1000),
    });
  });
  await SensorReading.insertMany(bacaan);

  await SensorReading.create({
    deviceId: 'ESP32_002',
    plantId: tomato._id.toString(),
    moisture: 48,
    temperature: 29,
    pumpStatus: true,
  });

  await WateringLog.create({
    deviceId: 'ESP32_001',
    plantId: chili._id.toString(),
    startedAt: new Date(sekarang - 75 * 60 * 1000),
    endedAt: new Date(sekarang - 74 * 60 * 1000),
    durationSec: 60,
    moistureBefore: 47,
    reason: 'auto',
  });

  console.log('Seed selesai.');
  console.log('CHILI_PLANT_ID=' + chili._id);
  console.log('TOMATO_PLANT_ID=' + tomato._id);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed gagal:', error.message);
  process.exit(1);
});
