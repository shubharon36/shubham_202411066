// server.js
// Load .env in dev/test. In production (Render) it's ok if dotenv isn't installed.
try {
  require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  });
} catch {
  console.log('[server] dotenv not found; relying on platform env vars');
}

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
    origin: allowed || true, // reflect request origin
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Bootstrap (skip when running tests)
if (process.env.NODE_ENV !== 'test') {
  // Connect to Mongo once
  connectMongoDB()
    .then(() => console.log('[server] MongoDB connected'))
    .catch((e) => console.error('[server] Mongo connection error:', e));

  // Ensure admin user exists in Postgres
  ensureAdminUser().catch((e) => console.error('ensureAdminUser error:', e));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
