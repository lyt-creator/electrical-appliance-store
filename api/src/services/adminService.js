const { db } = require('../database/index.js');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'electrical_appliance_store_secret_key';

class AdminService {
  login(data) {
    const admin = db.admin.find((a) => a.username === data.username);
    if (!admin) return null;
    if (data.password !== 'admin123') return null;
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
      },
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}

module.exports = { AdminService };
