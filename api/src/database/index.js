// In-memory database with JSON file persistence via Railway Volume
const fs = require('fs');
const path = require('path');

// Persistence directory: use /data (Railway Volume mount) if available, otherwise fallback to local
const DATA_DIR = fs.existsSync('/data') ? '/data' : path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default seed data
const defaultCategories = [
  { id: 1, name: '方太', logo: null, description: '方太集团创建于1996年，专注于高端厨房电器的研发和制造', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: '奥普', logo: null, description: '奥普电器始创于1993年，专业生产浴霸、集成吊顶等产品', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, name: '林内', logo: null, description: '林内成立于1920年，是全球领先的燃气具制造企业', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, name: '史密斯', logo: null, description: 'A.O.史密斯创立于1874年，专注于热水器、净水设备', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 5, name: '老板', logo: null, description: '老板电器创立于1979年，中国厨房电器领导品牌', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 6, name: '海尔', logo: null, description: '海尔集团创立于1984年，全球领先的家电品牌', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 7, name: '创维', logo: null, description: '创维集团成立于1988年，专业从事智能家电研发', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 8, name: '格力', logo: null, description: '格力电器成立于1991年，全球最大的空调制造商', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 9, name: '美的', logo: null, description: '美的集团成立于1968年，全球领先的家电企业', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const defaultProducts = [
  {
    id: 1,
    categoryId: 2,
    categoryName: '奥普',
    name: '奥普浴霸LTO1E',
    price: 2999,
    description: '智能恒温浴霸，集成照明、换气、取暖功能于一体，为您打造舒适的浴室体验。',
    images: ['/uploads/1784629557878-599012389-3.jpg'],
    detailImages: [],
    specs: '功率: 2600W\n照明: 24W\n换气: 120m3/h\n尺寸: 300x600mm',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    categoryId: 2,
    categoryName: '奥普',
    name: '奥普浴霸LTO2E',
    price: 3999,
    description: '高端智能浴霸，支持语音控制，一键开启舒适模式。',
    images: ['/uploads/1784629562500-370866613-5.jpg'],
    detailImages: [],
    specs: '功率: 3000W\n照明: 36W\n换气: 150m3/h\n尺寸: 300x600mm\n语音控制: 支持',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    categoryId: 6,
    categoryName: '海尔',
    name: '海尔冰箱BCD-500',
    price: 4599,
    description: '500升大容量变频冰箱，风冷无霜，智能控温。',
    images: ['/uploads/1784629888588-842271129-1.jpg'],
    detailImages: [],
    specs: '容量: 500L\n能效等级: 一级\n制冷方式: 风冷\n控温方式: 电脑控温',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    categoryId: 8,
    categoryName: '格力',
    name: '格力空调KFR-72',
    price: 5999,
    description: '3匹变频冷暖空调，节能静音，快速制冷制热。',
    images: ['/uploads/1784629891026-813402683-3.jpg'],
    detailImages: [],
    specs: '匹数: 3匹\n能效等级: 一级\n变频: 是\n制冷量: 7200W',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultAdmins = [
  { id: 1, username: 'admin', password: 'admin123', createdAt: new Date().toISOString() },
];

// Load data from file, or use defaults
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const saved = JSON.parse(raw);
      console.log('[DB] Loaded persisted data from', DATA_FILE);
      return saved;
    }
  } catch (err) {
    console.error('[DB] Failed to load data file, using defaults:', err.message);
  }
  console.log('[DB] No persisted data found, using seed defaults');
  return null;
}

const persisted = loadData();

let categories = persisted?.categories || [...defaultCategories];
let products = persisted?.products || [...defaultProducts];
let admins = persisted?.admins || [...defaultAdmins];
let categoryIdCounter = persisted?.categoryIdCounter || 10;
let productIdCounter = persisted?.productIdCounter || 5;

// Save data to file (called after every mutation)
let saveTimeout = null;
function persist() {
  // Debounce saves to avoid writing too frequently
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const data = { categories, products, admins, categoryIdCounter, productIdCounter };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      console.log('[DB] Data persisted to', DATA_FILE);
    } catch (err) {
      console.error('[DB] Failed to persist data:', err.message);
    }
  }, 100);
}

// Save immediately (used on shutdown)
function persistSync() {
  try {
    const data = { categories, products, admins, categoryIdCounter, productIdCounter };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[DB] Data persisted (sync) to', DATA_FILE);
  } catch (err) {
    console.error('[DB] Failed to persist data (sync):', err.message);
  }
}

// No SIGTERM/SIGINT handlers - data is persisted on every mutation via persist()
// Adding exit handlers caused Railway deployments to crash

const db = {
  categories: {
    getAll: async () => {
      return [...categories]
        .map(c => ({ pinned: false, pinnedAt: null, ...c }))
        .sort((a, b) => {
          // Pinned categories first
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          // Both pinned: sort by pinnedAt ascending (earlier pinned first)
          if (a.pinned && b.pinned) {
            return new Date(a.pinnedAt) - new Date(b.pinnedAt);
          }
          // Neither pinned: sort by createdAt descending (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
    },
    getById: async (id) => {
      const c = categories.find(c => c.id === id) || null;
      if (!c) return null;
      return { pinned: false, pinnedAt: null, ...c };
    },
    create: async (data) => {
      const category = {
        id: categoryIdCounter++,
        ...data,
        pinned: false,
        pinnedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      categories.push(category);
      persist();
      return category;
    },
    update: async (id, data) => {
      const idx = categories.findIndex(c => c.id === id);
      if (idx === -1) return null;
      categories[idx] = { ...categories[idx], ...data, updatedAt: new Date().toISOString() };
      persist();
      return categories[idx];
    },
    delete: async (id) => {
      const idx = categories.findIndex(c => c.id === id);
      if (idx !== -1) categories.splice(idx, 1);
      persist();
    },
  },
  products: {
    getAll: async (categoryId) => {
      let result = [...products];
      if (categoryId) {
        result = result.filter(p => p.categoryId === categoryId);
      }
      return result.map(p => ({ detailImages: [], ...p })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    getById: async (id) => {
      const p = products.find(p => p.id === id) || null;
      if (!p) return null;
      return { detailImages: [], ...p };
    },
    create: async (data) => {
      const product = {
        id: productIdCounter++,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      products.push(product);
      persist();
      return product;
    },
    update: async (id, data) => {
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return null;
      products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() };
      persist();
      return products[idx];
    },
    delete: async (id) => {
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) products.splice(idx, 1);
      persist();
    },
    search: async (keyword) => {
      const kw = keyword.toLowerCase();
      return products.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(kw)) ||
        (p.description && p.description.toLowerCase().includes(kw)) ||
        (p.specs && p.specs.toLowerCase().includes(kw))
      );
    },
  },
  admin: {
    getByUsername: async (username) => {
      return admins.find(a => a.username === username) || null;
    },
  },
};

module.exports = { db };
