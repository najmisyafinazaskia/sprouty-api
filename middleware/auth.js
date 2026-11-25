const jwt = require('jsonwebtoken');

// Untuk endpoint milik pengguna. Defaultnya MATI supaya aplikasi bisa langsung
// dicoba. Set REQUIRE_AUTH=true di .env kalau ingin dipaksa login.
function protect(req, res, next) {
  if (process.env.REQUIRE_AUTH !== 'true') return next();

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token akses belum diberikan.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'sprouty-secret');
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token akses tidak valid.' });
  }
}

// Untuk ESP32 yang mengirim data sensor. Aktif kalau DEVICE_API_KEY diisi.
function deviceAuth(req, res, next) {
  const kunci = process.env.DEVICE_API_KEY;
  if (!kunci) return next();

  if (req.headers['x-api-key'] !== kunci) {
    return res.status(401).json({ message: 'API key perangkat tidak valid.' });
  }
  return next();
}

module.exports = { protect, deviceAuth };
