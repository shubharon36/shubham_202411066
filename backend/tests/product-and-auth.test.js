// Load test env
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.test') });
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Product Sorting Tests', () => {
  beforeAll(async () => {
    // Connect to test Mongo
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce_products_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
  });

  afterAll(async () => {
    // Clean up and close connections
    await Product.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear products before each test
    await Product.deleteMany({});

    // Create test products with different prices
    await Product.create([
      { sku: 'TEST001', name: 'Product A', price: 100, category: 'Electronics' },
      { sku: 'TEST002', name: 'Product B', price: 250, category: 'Electronics' },
      { sku: 'TEST003', name: 'Product C', price: 50,  category: 'Electronics' },
      { sku: 'TEST004', name: 'Product D', price: 300, category: 'Electronics' },
      { sku: 'TEST005', name: 'Product E', price: 150, category: 'Electronics' }
    ]);
  });

  test('Should return products sorted by price in descending order by default', async () => {
    const res = await request(app).get('/api/products').expect(200);

    expect(res.body.products).toBeDefined();
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.sortOrder).toBe('desc');

    const prices = res.body.products.map(p => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
    expect(res.body.products[0].price).toBe(300);
  });

  test('Should return products sorted by price in ascending order when x-sort-order header is asc', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('x-sort-order', 'asc')
      .expect(200);

    expect(res.body.products).toBeDefined();
    expect(res.body.sortOrder).toBe('asc');

    const prices = res.body.products.map(p => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
    expect(res.body.products[0].price).toBe(50);
  });

  test('Should return products sorted by price in ascending order when sortOrder query param is asc', async () => {
    const res = await request(app).get('/api/products?sortOrder=asc').expect(200);

    expect(res.body.products).toBeDefined();
    expect(res.body.sortOrder).toBe('asc');

    const prices = res.body.products.map(p => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
    expect(res.body.products[0].price).toBe(50);
  });

  test('Should handle pagination correctly while maintaining sort order', async () => {
    const res = await request(app).get('/api/products?page=1&limit=3').expect(200);

    expect(res.body.products.length).toBe(3);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(3);
    expect(res.body.pagination.total).toBe(5);

    const prices = res.body.products.map(p => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  test('Should filter by category and maintain sort order', async () => {
    await Product.create({
      sku: 'TEST006',
      name: 'Product F',
      price: 200,
      category: 'Clothing'
    });

    const res = await request(app).get('/api/products?category=Electronics').expect(200);

    expect(res.body.products).toBeDefined();
    expect(res.body.products.every(p => p.category === 'Electronics')).toBe(true);

    const prices = res.body.products.map(p => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });
});

describe('Authentication Tests', () => {
  test('Should register a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'customer',
    };

    const res = await request(app).post('/api/auth/register').send(userData).expect(201);

    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.user.name).toBe(userData.name);
  });

  test('Should reject registration with invalid email', async () => {
    const userData = { name: 'Test User', email: 'invalid-email', password: 'password123' };
    const res = await request(app).post('/api/auth/register').send(userData).expect(400);
    expect(res.body.errors).toBeDefined();
  });

  test('Should reject registration with short password', async () => {
    const userData = { name: 'Test User', email: 'test@example.com', password: '123' };
    const res = await request(app).post('/api/auth/register').send(userData).expect(400);
    expect(res.body.errors).toBeDefined();
  });
});
