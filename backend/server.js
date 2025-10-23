// server.js
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const express = require('express');
const cors = require('cors');
const { connectMongoDB } = require('./config/database');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { ensureAdminUser } = require('./config/ensureAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
const allowed = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : undefined;

app.use(
  cors({
    origin: allowed || true, // true reflects request origin
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only connect to Mongo automatically outside of tests.
// In tests, your Jest suite connects to the test DB itself.
if (process.env.NODE_ENV !== 'test') {
  connectMongoDB();
}

ensureAdminUser().catch((e) => console.error('ensureAdminUser error:', e));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB & start server only when NOT testing
if (process.env.NODE_ENV !== 'test') {
  connectMongoDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// always export the app for supertest
module.exports = app;
