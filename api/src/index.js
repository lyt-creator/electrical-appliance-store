const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const { db } = require('./database/index.js');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'electrical_appliance_store_secret_key';

const fs = require('fs');

// Use /data/uploads (Railway Volume) for persistence, fallback to local for dev
const dataDir = fs.existsSync('/data') ? '/data' : path.join(__dirname, '../data');
const uploadDir = path.join(dataDir, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Copy seed images from built-in uploads to volume on first run
const seedUploadDir = path.join(__dirname, '../uploads');
if (fs.existsSync(seedUploadDir)) {
  try {
    const seedFiles = fs.readdirSync(seedUploadDir);
    for (const file of seedFiles) {
      const destPath = path.join(uploadDir, file);
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(path.join(seedUploadDir, file), destPath);
      }
    }
    if (seedFiles.length > 0) {
      console.log(`[Server] Copied ${seedFiles.length} seed images to ${uploadDir}`);
    }
  } catch (err) {
    console.error('[Server] Failed to copy seed images:', err.message);
  }
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

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  try {
    const admin = await db.admin.getByUsername(username);
    if (!admin || password !== 'admin123') {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: admin.id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ error: '登录失败: ' + error.message });
  }
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

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.categories.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: '获取分类失败: ' + error.message });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const category = await db.categories.getById(id);
    if (!category) return res.status(404).json({ error: '分类不存在' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: '获取分类失败: ' + error.message });
  }
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  const { name, logo, description } = req.body;
  if (!name) return res.status(400).json({ error: '分类名称不能为空' });
  try {
    const category = await db.categories.create({ name, logo: logo || null, description: description || null });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: '创建分类失败: ' + error.message });
  }
});

app.put('/api/categories/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, logo, description } = req.body;
  if (!name) return res.status(400).json({ error: '分类名称不能为空' });
  try {
    const category = await db.categories.update(id, { name, logo: logo || null, description: description || null });
    if (!category) return res.status(404).json({ error: '分类不存在' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: '更新分类失败: ' + error.message });
  }
});

app.delete('/api/categories/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.categories.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '删除分类失败: ' + error.message });
  }
});

app.get('/api/products', async (req, res) => {
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;
  try {
    let products = await db.products.getAll(categoryId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: '获取产品失败: ' + error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await db.products.getById(id);
    if (!product) return res.status(404).json({ error: '产品不存在' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: '获取产品失败: ' + error.message });
  }
});

app.post('/api/products', authMiddleware, async (req, res) => {
  const { name, categoryId, price, description, images, specs } = req.body;
  if (!name || !categoryId || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: '缺少必填字段' });
  }
  try {
    const category = await db.categories.getById(categoryId);
    const product = await db.products.create({
      category_id: categoryId,
      category_name: category?.name || '未知分类',
      name,
      price,
      description: description || null,
      images,
      specs: specs || null,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: '创建产品失败: ' + error.message });
  }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, categoryId, price, description, images, specs } = req.body;
  if (!name || !categoryId || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: '缺少必填字段' });
  }
  try {
    const category = await db.categories.getById(categoryId);
    const product = await db.products.update(id, {
      categoryId,
      categoryName: category?.name || '未知分类',
      name,
      price,
      description: description || null,
      images,
      specs: specs || null,
    });
    if (!product) return res.status(404).json({ error: '产品不存在' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: '更新产品失败: ' + error.message });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.products.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '删除产品失败: ' + error.message });
  }
});

app.get('/api/search', async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.status(400).json({ error: '搜索关键词不能为空' });
  try {
    const products = await db.products.search(keyword);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: '搜索失败: ' + error.message });
  }
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

// Serve built frontend in production
const distDir = path.join(__dirname, '../../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log('[Server] Serving frontend from', distDir);
} else {
  console.log('[Server] No dist directory found at', distDir);
}

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
