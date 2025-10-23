const { PrismaClient } = require('@prisma/client');
const Product = require('../models/Product');
const { getCartForUser, clearCartForUser } = require('../stores/cartStore');

const prisma = new PrismaClient();

function getAvailableStock(product) {
  const n = Number(product?.stock);
  return Number.isFinite(n) && n >= 0 ? n : 1e9;
}

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Prefer explicit items from client; otherwise fall back to server cart
    let items = Array.isArray(req.body?.items) ? req.body.items : null;
    if (!items || items.length === 0) {
      const serverCart = getCartForUser(userId);
      items = serverCart.items || [];
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let calculatedTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      const qty = Number(item.quantity || 0);
      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({ error: `Invalid quantity for product ${product.name}` });
      }

      const available = getAvailableStock(product);
      if (available < qty) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const price = Number(product.price || 0);
      calculatedTotal += price * qty;

      orderItemsData.push({
        productId: item.productId,
        quantity: qty,
        priceAtPurchase: price
      });
    }

    // Decrement stock after validation
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -Number(item.quantity) } });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total: calculatedTotal,
        status: 'completed',
        orderItems: { create: orderItemsData }
      },
      include: { orderItems: true }
    });

    // Clear server cart after successful order
    clearCartForUser(userId);

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    const where = role === 'admin' ? {} : { userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: true
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (role !== 'admin' && order.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const orderItemsWithProducts = await Promise.all(
      order.orderItems.map(async (oi) => {
        const product = await Product.findById(oi.productId);
        return {
          ...oi,
          product: product ? { name: product.name, imageUrl: product.imageUrl } : null
        };
      })
    );

    res.json({ order: { ...order, orderItems: orderItemsWithProducts } });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({ where: { id }, data: { status } });
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };
