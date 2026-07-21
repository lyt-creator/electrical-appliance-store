const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { db, categoryIdCounter, productIdCounter } = require('./database/index.js');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'electrical_appliance_store_secret_key';

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  const admin = db.admin.find((a) => a.username === username);
  if (!admin || password !== 'admin123') {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: admin.id, username: admin.username } });
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未授权' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: '无效的token' });
  }
};

app.get('/api/categories', (req, res) => {
  const categories = [...db.categories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(categories);
});

app.get('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const category = db.categories.find((c) => c.id === id);
  if (!category) return res.status(404).json({ error: '分类不存在' });
  res.json(category);
});

app.post('/api/categories', authMiddleware, (req, res) => {
  const { name, logo, description } = req.body;
  if (!name) return res.status(400).json({ error: '分类名称不能为空' });
  const now = new Date().toISOString();
  const category = { id: categoryIdCounter++, name, logo: logo || undefined, description: description || undefined, createdAt: now, updatedAt: now };
  db.categories.push(category);
  res.status(201).json(category);
});

app.put('/api/categories/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const { name, logo, description } = req.body;
  if (!name) return res.status(400).json({ error: '分类名称不能为空' });
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ error: '分类不存在' });
  db.categories[index] = { ...db.categories[index], name, logo: logo || undefined, description: description || undefined, updatedAt: new Date().toISOString() };
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const category = db.categories.find((c) => c.id === id);
  if (!category) return res.status(404).json({ error: '分类不存在' });
  db.categories = db.categories.filter((c) => c.id !== id);
  db.products = db.products.filter((p) => p.categoryId !== id);
  res.status(204).send();
});

app.get('/api/products', (req, res) => {
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;
  let products = [...db.products];
  if (categoryId) products = products.filter((p) => p.categoryId === categoryId);
  products = products.map((p) => {
    const category = db.categories.find((c) => c.id === p.categoryId);
    return { ...p, categoryName: category?.name || '未知分类' };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = db.products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: '产品不存在' });
  const category = db.categories.find((c) => c.id === product.categoryId);
  res.json({ ...product, categoryName: category?.name || '未知分类' });
});

app.post('/api/products', authMiddleware, (req, res) => {
  const { name, categoryId, price, description, images, specs } = req.body;
  if (!name || !categoryId || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: '缺少必填字段' });
  }
  const now = new Date().toISOString();
  const category = db.categories.find((c) => c.id === categoryId);
  const product = { id: productIdCounter++, categoryId, categoryName: category?.name || '未知分类', name, price, description: description || undefined, images, specs: specs || undefined, createdAt: now, updatedAt: now };
  db.products.push(product);
  res.status(201).json(product);
});

app.put('/api/products/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const { name, categoryId, price, description, images, specs } = req.body;
  if (!name || !categoryId || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: '缺少必填字段' });
  }
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: '产品不存在' });
  const category = db.categories.find((c) => c.id === categoryId);
  db.products[index] = { ...db.products[index], name, categoryId, categoryName: category?.name || '未知分类', price, description: description || undefined, images, specs: specs || undefined, updatedAt: new Date().toISOString() };
  res.json(db.products[index]);
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const product = db.products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: '产品不存在' });
  db.products = db.products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.get('/api/search', (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.status(400).json({ error: '搜索关键词不能为空' });
  const likeKeyword = keyword.toLowerCase();
  const products = db.products.map((p) => {
    const category = db.categories.find((c) => c.id === p.categoryId);
    return { ...p, categoryName: category?.name || '未知分类' };
  }).filter((p) => p.name.toLowerCase().includes(likeKeyword) || p.categoryName.toLowerCase().includes(likeKeyword) || (p.description && p.description.toLowerCase().includes(likeKeyword)));
  res.json(products);
});

app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的图片' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: '上传失败: ' + error.message });
  }
});

// 生产模式：托管前端构建文件
const distDir = path.join(__dirname, '../../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // 客户端路由的 catch-all：所有非 /api 和 /uploads 的请求返回 index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
      res.sendFile(path.join(distDir, 'index.html'));
    }
  });
  console.log('前端构建文件已加载，目录:', distDir);
}

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
