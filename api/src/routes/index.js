const { Router } = require('express');
const { CategoryController } = require('../controllers/categoryController.js');
const { ProductController } = require('../controllers/productController.js');
const { AdminController } = require('../controllers/adminController.js');
const { authMiddleware } = require('../middleware/auth.js');
const { CategoryService } = require('../services/categoryService.js');
const { ProductService } = require('../services/productService.js');
const { AdminService } = require('../services/adminService.js');

const createRoutes = () => {
  const router = Router();

  const categoryService = new CategoryService();
  const productService = new ProductService();
  const adminService = new AdminService();

  const categoryController = new CategoryController(categoryService);
  const productController = new ProductController(productService);
  const adminController = new AdminController(adminService);

  const auth = authMiddleware(adminService);

  router.post('/admin/login', adminController.login);
  router.get('/admin/verify', adminController.verify);

  router.get('/categories', categoryController.getAll);
  router.get('/categories/:id', categoryController.getById);
  router.post('/categories', auth, categoryController.create);
  router.put('/categories/:id', auth, categoryController.update);
  router.delete('/categories/:id', auth, categoryController.delete);

  router.get('/products', productController.getAll);
  router.get('/products/:id', productController.getById);
  router.post('/products', auth, productController.create);
  router.put('/products/:id', auth, productController.update);
  router.delete('/products/:id', auth, productController.delete);

  router.get('/search', productController.search);

  return router;
};

module.exports = { createRoutes };
