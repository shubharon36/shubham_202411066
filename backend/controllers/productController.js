const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// helper to normalize numbers safely
function toNonNegativeNumber(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

// Get all products (unchanged)
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice
    } = req.query;

    const q = {};
    if (category) q.category = category;
    if (search) q.$text = { $search: search };
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = parseFloat(minPrice);
      if (maxPrice) q.price.$lte = parseFloat(maxPrice);
    }

    // default sort: price desc; allow ?sortOrder=asc or header x-sort-order: asc
    const sortOrder = (req.headers['x-sort-order'] === 'asc' || req.query.sortOrder === 'asc') ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find(q).sort({ price: sortOrder }).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(q)
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      sortOrder: sortOrder === 1 ? 'asc' : 'desc'
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get one (unchanged)
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create (normalize price & stock)
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { sku, name, description, category, imageUrl } = req.body;

    const existing = await Product.findOne({ sku });
    if (existing) return res.status(400).json({ error: 'Product with this SKU already exists' });

    const price = toNonNegativeNumber(req.body.price, 0);
    // If stock missing/invalid → default to 100 (your schema default), never negative
    const stock = toNonNegativeNumber(req.body.stock, 100);

    const product = await Product.create({
      sku,
      name,
      description: description ?? '',
      price,
      category,
      stock,
      imageUrl: imageUrl ?? ''
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update (normalize price & stock and avoid accidentally writing 0)
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { sku, name, description, category, imageUrl } = req.body;
    const payload = {
      updatedAt: Date.now()
    };

    if (sku !== undefined) payload.sku = sku;
    if (name !== undefined) payload.name = name;
    if (description !== undefined) payload.description = description;
    if (category !== undefined) payload.category = category;
    if (imageUrl !== undefined) payload.imageUrl = imageUrl;

    if (req.body.price !== undefined)
      payload.price = toNonNegativeNumber(req.body.price, 0);

    if (req.body.stock !== undefined)
      payload.stock = toNonNegativeNumber(req.body.stock, 0);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete (unchanged)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Categories (unchanged)
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
