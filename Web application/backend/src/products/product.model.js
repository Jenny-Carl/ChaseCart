// src/products/product.model.js
const db = require('../firebase');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.description = data.description;
    this.price = data.price;
    this.oldPrice = data.oldPrice || null;
    this.image = data.image;
    this.author = data.author;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get all products
  static async getAll() {
    try {
      const snapshot = await db.collection('products').get();
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  // Get product by ID
  static async getById(id) {
    try {
      const doc = await db.collection('products').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  // Get products by category
  static async getByCategory(category) {
    try {
      const snapshot = await db.collection('products')
        .where('category', '==', category)
        .get();
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }
  }

  // Search products by name
  static async searchByName(searchTerm) {
    try {
      const snapshot = await db.collection('products').get();
      const products = [];
      snapshot.forEach(doc => {
        const product = { id: doc.id, ...doc.data() };
        if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          products.push(product);
        }
      });
      return products;
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }
}

module.exports = Product;