require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const wateringRoutes = require('./routes/wateringRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Sprouty API',
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/watering', wateringRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sprouty API berjalan di http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('Gagal menyambung MongoDB:', error.message);
    process.exit(1);
  });
