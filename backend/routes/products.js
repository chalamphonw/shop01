const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const { validateProductData } = require('../middleware/validation');

// GET all products (Public)
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, color, promotion, bestSale } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (color) filter.color = color;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (promotion === 'true') filter['promotion.isActive'] = true;
    if (bestSale === 'true') filter.isBestSale = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// GET single product (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// GET recommended products in same category
router.get('/:id/recommended', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const recommended = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
});

// CREATE product (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const errors = validateProductData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors });
    }

    const { productId, name, price, color, category, images, description, stock, datasheet, promotion, isBestSale } = req.body;

    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }

    const product = new Product({
      productId,
      name,
      price,
      color,
      category,
      images: images || [],
      description,
      stock,
      datasheet: datasheet || null,
      promotion: promotion || { isActive: false, discountPercent: 0 },
      isBestSale: isBestSale || false
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// UPDATE product (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const errors = validateProductData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// DELETE product (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
