// backend/routes/productRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const productValidation = [
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories); // keep this *before* :id
router.get('/:id', getProduct);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), productValidation, createProduct);
router.put('/:id', authenticate, authorize('admin'), productValidation, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;
