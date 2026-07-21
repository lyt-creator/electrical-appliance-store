const { ProductService } = require('../services/productService.js');

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  getAll = (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : undefined;
      const products = this.productService.getAll(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: '获取产品失败' });
    }
  };

  getById = (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = this.productService.getById(id);
      if (!product) {
        return res.status(404).json({ error: '产品不存在' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: '获取产品失败' });
    }
  };

  create = (req, res) => {
    try {
      const { name, categoryId, price, description, images, specs } = req.body;
      if (!name || !categoryId || !price || !images || !Array.isArray(images)) {
        return res.status(400).json({ error: '缺少必填字段' });
      }
      const product = this.productService.create({ name, categoryId, price, description, images, specs });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: '创建产品失败' });
    }
  };

  update = (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, categoryId, price, description, images, specs } = req.body;
      if (!name || !categoryId || !price || !images || !Array.isArray(images)) {
        return res.status(400).json({ error: '缺少必填字段' });
      }
      const product = this.productService.update(id, { name, categoryId, price, description, images, specs });
      if (!product) {
        return res.status(404).json({ error: '产品不存在' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: '更新产品失败' });
    }
  };

  delete = (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = this.productService.getById(id);
      if (!product) {
        return res.status(404).json({ error: '产品不存在' });
      }
      this.productService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: '删除产品失败' });
    }
  };

  search = (req, res) => {
    try {
      const keyword = req.query.q;
      if (!keyword) {
        return res.status(400).json({ error: '搜索关键词不能为空' });
      }
      const products = this.productService.search(keyword);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: '搜索失败' });
    }
  };
}

module.exports = { ProductController };
