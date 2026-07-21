const { db, productIdCounter } = require('../database/index.js');

class ProductService {
  getAll(categoryId) {
    let products = [...db.products];
    if (categoryId) {
      products = products.filter((p) => p.categoryId === categoryId);
    }
    return products
      .map((p) => {
        const category = db.categories.find((c) => c.id === p.categoryId);
        return {
          ...p,
          categoryName: category?.name || '未知分类',
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getById(id) {
    const product = db.products.find((p) => p.id === id);
    if (!product) return undefined;
    const category = db.categories.find((c) => c.id === product.categoryId);
    return {
      ...product,
      categoryName: category?.name || '未知分类',
    };
  }

  create(data) {
    const now = new Date().toISOString();
    const category = db.categories.find((c) => c.id === data.categoryId);
    const product = {
      id: productIdCounter++,
      categoryId: data.categoryId,
      categoryName: category?.name || '未知分类',
      name: data.name,
      price: data.price,
      description: data.description || undefined,
      images: data.images,
      specs: data.specs || undefined,
      createdAt: now,
      updatedAt: now,
    };
    db.products.push(product);
    return product;
  }

  update(id, data) {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    const category = db.categories.find((c) => c.id === data.categoryId);
    db.products[index] = {
      ...db.products[index],
      name: data.name,
      categoryId: data.categoryId,
      categoryName: category?.name || '未知分类',
      price: data.price,
      description: data.description || undefined,
      images: data.images,
      specs: data.specs || undefined,
      updatedAt: new Date().toISOString(),
    };
    return db.products[index];
  }

  delete(id) {
    db.products = db.products.filter((p) => p.id !== id);
  }

  search(keyword) {
    const likeKeyword = keyword.toLowerCase();
    return db.products
      .map((p) => {
        const category = db.categories.find((c) => c.id === p.categoryId);
        return {
          ...p,
          categoryName: category?.name || '未知分类',
        };
      })
      .filter(
        (p) =>
          p.name.toLowerCase().includes(likeKeyword) ||
          p.categoryName.toLowerCase().includes(likeKeyword) ||
          (p.description && p.description.toLowerCase().includes(likeKeyword))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

module.exports = { ProductService };
