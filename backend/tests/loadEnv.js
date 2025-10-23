const path = require('path');
const dotenv = require('dotenv');

// Load .env.test (falls back to .env if missing)
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

// Make sure NODE_ENV=test for server conditionals
process.env.NODE_ENV = 'test';
