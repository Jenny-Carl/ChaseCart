// src/products/product.route.js
const express = require('express');
const Product = require('./product.model');

const router = express.Router();

// GET /api/products - Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/products/category/:category', async (req, res) => {
  try {
    const products = await Product.getByCategory(req.params.category);
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/products/search/:term - Search products by name
router.get('/products/search/:term', async (req, res) => {
  try {
    const products = await Product.searchByName(req.params.term);
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;