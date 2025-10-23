const express = require('express');
const {
  getDailyRevenue,
  getTopCustomers,
  getCategorySales,
  getProductPerformance,
  getDashboard
} = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All report routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/daily-revenue', getDailyRevenue);
router.get('/top-customers', getTopCustomers);
router.get('/category-sales', getCategorySales);
router.get('/product-performance', getProductPerformance);

module.exports = router;