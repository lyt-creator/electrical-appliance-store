const { AdminService } = require('../services/adminService.js');

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  login = (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
      }
      const result = this.adminService.login({ username, password });
      if (!result) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: '登录失败' });
    }
  };

  verify = (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: '未授权' });
      }
      const decoded = this.adminService.verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: '无效的token' });
      }
      res.json(decoded);
    } catch (error) {
      res.status(500).json({ error: '验证失败' });
    }
  };
}

module.exports = { AdminController };
