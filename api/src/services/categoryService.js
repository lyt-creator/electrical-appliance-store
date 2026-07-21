const { db, categoryIdCounter } = require('../database/index.js');

class CategoryService {
  getAll() {
    return [...db.categories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getById(id) {
    return db.categories.find((c) => c.id === id);
  }

  create(data) {
    const now = new Date().toISOString();
    const category = {
      id: categoryIdCounter++,
      name: data.name,
      logo: data.logo || undefined,
      description: data.description || undefined,
      createdAt: now,
      updatedAt: now,
    };
    db.categories.push(category);
    return category;
  }

  update(id, data) {
    const index = db.categories.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    db.categories[index] = {
      ...db.categories[index],
      name: data.name,
      logo: data.logo || undefined,
      description: data.description || undefined,
      updatedAt: new Date().toISOString(),
    };
    return db.categories[index];
  }

  delete(id) {
    db.categories = db.categories.filter((c) => c.id !== id);
    db.products = db.products.filter((p) => p.categoryId !== id);
  }
}

module.exports = { CategoryService };
