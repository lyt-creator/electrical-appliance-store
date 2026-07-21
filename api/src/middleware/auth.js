const { AdminService } = require('../services/adminService.js');

const authMiddleware = (adminService) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未授权' });
    }
    const decoded = adminService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: '无效的token' });
    }
    req.admin = decoded;
    next();
  };
};

module.exports = { authMiddleware };
