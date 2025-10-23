const { PrismaClient } = require('@prisma/client');
const Product = require('../models/Product');

const prisma = new PrismaClient();

// SQL Aggregation: Daily revenue report
const getDailyRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const whereClause = {
      status: 'completed'
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    // Get daily revenue using Prisma aggregation
    const orders = await prisma.order.groupBy({
      by: ['createdAt'],
      where: whereClause,
      _sum: {
        total: true
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format results by date
    const dailyRevenue = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          revenue: 0,
          orderCount: 0
        };
      }
      
      acc[date].revenue += order._sum.total || 0;
      acc[date].orderCount += order._count.id;
      
      return acc;
    }, {});

    const result = Object.values(dailyRevenue);

    res.json({
      title: 'Daily Revenue Report',
      data: result,
      totalRevenue: result.reduce((sum, day) => sum + day.revenue, 0),
      totalOrders: result.reduce((sum, day) => sum + day.orderCount, 0)
    });
  } catch (error) {
    console.error('Get daily revenue error:', error);
    res.status(500).json({ error: 'Failed to fetch daily revenue' });
  }
};

// SQL Aggregation: Top customers
const getTopCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topCustomers = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        status: 'completed'
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          total: 'desc'
        }
      },
      take: limit
    });

    // Get user details
    const customersWithDetails = await Promise.all(
      topCustomers.map(async (customer) => {
        const user = await prisma.user.findUnique({
          where: { id: customer.userId },
          select: {
            id: true,
            name: true,
            email: true
          }
        });

        return {
          user,
          totalSpent: customer._sum.total || 0,
          orderCount: customer._count.id
        };
      })
    );

    res.json({
      title: 'Top Customers',
      data: customersWithDetails
    });
  } catch (error) {
    console.error('Get top customers error:', error);
    res.status(500).json({ error: 'Failed to fetch top customers' });
  }
};

// MongoDB Aggregation: Category-wise sales
const getCategorySales = async (req, res) => {
  try {
    // Get all completed orders with items
    const orders = await prisma.order.findMany({
      where: {
        status: 'completed'
      },
      include: {
        orderItems: true
      }
    });

    // Extract all product IDs
    const productIds = orders.flatMap(order => 
      order.orderItems.map(item => item.productId)
    );

    // Get products from MongoDB
    const products = await Product.find({
      _id: { $in: productIds }
    });

    // Create product map
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });

    // Calculate category sales
    const categorySales = {};

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const product = productMap[item.productId];
        if (product) {
          const category = product.category;
          if (!categorySales[category]) {
            categorySales[category] = {
              category,
              totalRevenue: 0,
              totalQuantity: 0,
              productCount: new Set()
            };
          }
          
          categorySales[category].totalRevenue += item.priceAtPurchase * item.quantity;
          categorySales[category].totalQuantity += item.quantity;
          categorySales[category].productCount.add(item.productId);
        }
      });
    });

    // Format result
    const result = Object.values(categorySales).map(cat => ({
      category: cat.category,
      totalRevenue: cat.totalRevenue,
      totalQuantity: cat.totalQuantity,
      uniqueProducts: cat.productCount.size
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    res.json({
      title: 'Category-wise Sales Report',
      data: result
    });
  } catch (error) {
    console.error('Get category sales error:', error);
    res.status(500).json({ error: 'Failed to fetch category sales' });
  }
};

// MongoDB Aggregation: Product performance
const getProductPerformance = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get all orders with items
    const orders = await prisma.order.findMany({
      where: {
        status: 'completed'
      },
      include: {
        orderItems: true
      }
    });

    // Calculate product performance
    const productStats = {};

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            productId: item.productId,
            totalRevenue: 0,
            totalQuantity: 0,
            orderCount: 0
          };
        }
        
        productStats[item.productId].totalRevenue += item.priceAtPurchase * item.quantity;
        productStats[item.productId].totalQuantity += item.quantity;
        productStats[item.productId].orderCount += 1;
      });
    });

    // Get top products
    const topProductIds = Object.values(productStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit)
      .map(p => p.productId);

    // Get product details from MongoDB
    const products = await Product.find({
      _id: { $in: topProductIds }
    });

    // Combine stats with product details
    const result = topProductIds.map(id => {
      const product = products.find(p => p._id.toString() === id);
      const stats = productStats[id];
      
      return {
        productId: id,
        name: product?.name || 'Unknown',
        category: product?.category || 'Unknown',
        currentPrice: product?.price || 0,
        totalRevenue: stats.totalRevenue,
        totalQuantity: stats.totalQuantity,
        orderCount: stats.orderCount
      };
    });

    res.json({
      title: 'Top Selling Products',
      data: result
    });
  } catch (error) {
    console.error('Get product performance error:', error);
    res.status(500).json({ error: 'Failed to fetch product performance' });
  }
};

// Combined dashboard report
const getDashboard = async (req, res) => {
  try {
    // Total revenue
    const totalRevenueResult = await prisma.order.aggregate({
      where: {
        status: 'completed'
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      }
    });

    // Total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'customer'
      }
    });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      summary: {
        totalRevenue: totalRevenueResult._sum.total || 0,
        totalOrders: totalRevenueResult._count.id,
        totalCustomers,
        totalProducts
      },
      recentOrders
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = {
  getDailyRevenue,
  getTopCustomers,
  getCategorySales,
  getProductPerformance,
  getDashboard
};