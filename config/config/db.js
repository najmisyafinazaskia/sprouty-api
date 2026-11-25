const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI belum diisi. Salin .env.example menjadi .env lalu isi connection string Atlas Anda.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB tersambung:', mongoose.connection.name);
}

module.exports = connectDB;
