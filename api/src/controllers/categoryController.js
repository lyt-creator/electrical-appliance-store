const { CategoryService } = require('../services/categoryService.js');

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  getAll = (_req, res) => {
    try {
      const categories = this.categoryService.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: '获取分类失败' });
    }
  };

  getById = (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = this.categoryService.getById(id);
      if (!category) {
        return res.status(404).json({ error: '分类不存在' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: '获取分类失败' });
    }
  };

  create = (req, res) => {
    try {
      const { name, logo, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: '分类名称不能为空' });
      }
      const category = this.categoryService.create({ name, logo, description });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: '创建分类失败' });
    }
  };

  update = (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, logo, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: '分类名称不能为空' });
      }
      const category = this.categoryService.update(id, { name, logo, description });
      if (!category) {
        return res.status(404).json({ error: '分类不存在' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: '更新分类失败' });
    }
  };

  delete = (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = this.categoryService.getById(id);
      if (!category) {
        return res.status(404).json({ error: '分类不存在' });
      }
      this.categoryService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: '删除分类失败' });
    }
  };
}

module.exports = { CategoryController };
