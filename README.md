# ShopHub – Full-Stack E-Commerce Platform

> A production-ready e-commerce application built with Node.js, Express, Next.js, PostgreSQL, and MongoDB demonstrating modern web development practices.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://shubham-202411066.vercel.app)
[![Backend API](https://img.shields.io/badge/API-online-blue)](https://shubham-202411066.onrender.com/api)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Live Deployments](#live-deployments)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

---

## 🎯 Overview

ShopHub is a full-stack e-commerce web application implementing clean MVC architecture on the backend with a modern Next.js frontend. The application demonstrates:

- JWT-based authentication with role-based access control
- Product catalog management using MongoDB
- Transactional order processing with PostgreSQL
- Shopping cart and checkout functionality
- Admin dashboard for product management
- Server-side sorting and filtering
- Analytics reports using SQL and MongoDB aggregations

---

## ✨ Key Features

### Authentication & Authorization
- **JWT + bcrypt** secure authentication
- Role-based access control (Admin, Customer)
- Register, login, logout functionality

### Product Management
- **CRUD operations** for administrators
- Search functionality with text indexing
- Category filtering
- Pagination support
- **Server-side sorting** (default: price DESC, override via query param `?sortOrder=asc` or header `x-sort-order: asc`)

### Shopping Experience
- Add/update/remove items from cart
- Server-calculated totals
- Secure checkout process
- Order history tracking

### Order Management
- PostgreSQL-backed order persistence
- Order header + line items structure
- Admin order management
- Customer order tracking

### Analytics & Reporting
- SQL aggregation reports (e.g., daily revenue)
- MongoDB aggregation reports (e.g., category-wise sales)

### User Interface
- Responsive design with Next.js App Router
- Protected admin pages
- Modern CSS Modules styling
- Context-based state management

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15+ (App Router, TypeScript)
- **Styling:** CSS Modules with utility classes
- **State Management:** React Context API
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express (MVC Architecture)
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Deployment:** Render

### Databases
- **PostgreSQL:** Orders and order items (via Prisma ORM)
- **MongoDB:** Product catalog (via Mongoose)

### Testing
- **Backend:** Jest + Supertest
- **Frontend:** Manual QA checklist

---

## 🌐 Live Deployments

### Frontend
- **Production:** [https://shubham-202411066.vercel.app](https://shubham-202411066.vercel.app)
- **Preview:** [https://shubham-202411066-git-main-shubharon36s-projects.vercel.app/](https://shubham-202411066-git-main-shubharon36s-projects.vercel.app/)

### Backend
- **Base URL:** [https://shubham-202411066.onrender.com](https://shubham-202411066.onrender.com)
- **API Base:** [https://shubham-202411066.onrender.com/api](https://shubham-202411066.onrender.com/api)
- **Health Check:** [https://shubham-202411066.onrender.com/health](https://shubham-202411066.onrender.com/health)

### Admin Credentials (For Evaluation)
```
Email: admin@shophub.local
Password: admin123
```

> ⚠️ **Note:** Change these credentials in production environments.

---

## 📁 Project Structure

```
.
├── backend/                 # Node/Express MVC Backend
│   ├── config/             # Database connections, admin seeding
│   ├── controllers/        # Business logic (auth, product, cart, order, report)
│   ├── middleware/         # Authentication & authorization
│   ├── models/             # Mongoose models (Product)
│   ├── prisma/             # Prisma schema & migrations (orders, items, users)
│   ├── routes/             # Express route definitions
│   ├── server.js           # Application entry point
│   └── package.json
│
└── frontend/               # Next.js Frontend
    ├── src/
    │   └── app/
    │       ├── (main)/     # Store-facing pages (products, cart, checkout)
    │       ├── (auth)/     # Authentication pages (login, register)
    │       ├── admin/      # Admin-only pages
    │       ├── lib/        # API helpers and utilities
    │       └── styles/     # CSS Modules
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (v22 recommended)
- npm or pnpm
- PostgreSQL instance
- MongoDB (local or Atlas cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL (Prisma)
DATABASE_URL="postgresql://<user>:<password>@127.0.0.1:5432/ecomm_db?schema=public"

# MongoDB (Products)
MONGODB_URI="mongodb://127.0.0.1:27017/ecommerce_products"

# JWT
JWT_SECRET="change-me-please"

# CORS (your local Next dev URL)
CORS_ORIGIN="http://localhost:3000"

# Admin Seed (optional)
ADMIN_EMAIL="admin@shophub.local"
ADMIN_PASSWORD="Admin@12345"
ADMIN_NAME="Shop Admin"
```

Run database migrations and start the server:

```bash
# Apply Prisma migrations
npx prisma migrate dev

# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:

```env
# Always include /api at the end
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

### Backend (Production - Render)

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=<your-render-postgresql-url>
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=https://shubham-202411066.vercel.app
ADMIN_EMAIL=admin@shophub.local
ADMIN_PASSWORD=admin123
ADMIN_NAME=Shop Admin
```

### Frontend (Production - Vercel)

```env
NEXT_PUBLIC_API_URL=https://shubham-202411066.onrender.com/api
```

> ⚠️ **Important:** The frontend must NOT call localhost in production. Remove any rewrites to localhost in `next.config.js`.

---

## 💾 Database Configuration

### PostgreSQL (via Prisma)

**Entities:** `users`, `orders`, `order_items`

#### Local Development

```bash
cd backend
npx prisma migrate dev
```

#### Production Deployment

```bash
npx prisma migrate deploy
```

### MongoDB (Products)

**Collection:** `products`

**Indexes:**
- Text index on `name` and `description` for search
- Compound index on `category` + `price` for filtering

**Atlas Connection String Example:**

```
mongodb+srv://<user>:<URL_ENCODED_PASSWORD>@cluster0.xxxxx.mongodb.net/ecommerce_products?retryWrites=true&w=majority&appName=Cluster0
```

---

## 📡 API Documentation

### Base URL
```
/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get user profile | Yes |

**Request Body Examples:**

```json
// Register/Login
{
  "name": "John Doe",      // register only
  "email": "user@example.com",
  "password": "securepass123"
}
```

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | List products with filters | No |
| GET | `/products/categories` | List all categories | No |
| GET | `/products/:id` | Get product details | No |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |

**Query Parameters for `/products`:**
- `page` (default: 1)
- `limit` (default: 10)
- `category` (filter by category)
- `search` (text search on name/description)
- `sortOrder` (asc/desc, default: desc by price)

**Alternative:** Use header `x-sort-order: asc` for sorting.

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get current cart | Yes |
| POST | `/cart/add` | Add item to cart | Yes |
| PUT | `/cart/update` | Update item quantity | Yes |
| DELETE | `/cart/:productId` | Remove item | Yes |
| DELETE | `/cart` | Clear cart | Yes |

**Request Body Examples:**

```json
// Add to cart
{
  "productId": "60d5ec49f1b2c8b1f8e4e1a1",
  "quantity": 2
}

// Update cart
{
  "productId": "60d5ec49f1b2c8b1f8e4e1a1",
  "quantity": 0  // 0 removes the item
}
```

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order | Yes |
| GET | `/orders` | List orders | Yes |
| GET | `/orders/:id` | Get order details | Yes |
| PUT | `/orders/:id/status` | Update order status | Admin |

**Request Body Examples:**

```json
// Create order
{
  "items": [
    {
      "productId": "60d5ec49f1b2c8b1f8e4e1a1",
      "quantity": 2
    }
  ]
}

// Update status
{
  "status": "completed"  // pending | completed | cancelled
}
```

### Report Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reports/sql/daily-revenue` | SQL aggregation report | Admin |
| GET | `/reports/mongo/category-sales` | MongoDB aggregation report | Admin |

---

## 🧪 Testing

### Backend Testing (Jest + Supertest)

```bash
cd backend
npm test
```

**Test Coverage:**
- Authentication (register/login/profile)
- Product listing with filters and server-side sorting
- Cart lifecycle (add/update/remove)
- Order creation (stock validation, total calculation, persistence)

**Adding Test Script:**

If not present, add to `backend/package.json`:

```json
"scripts": {
  "test": "jest --runInBand"
}
```

### Manual QA Checklist

- [ ] Browse `/products` → filter by category/search → verify server-sorted results
- [ ] Add items to cart → update quantities → verify totals update correctly
- [ ] Complete checkout → verify new order appears in database
- [ ] Admin: `/admin/products` → create/update/delete product → verify on storefront
- [ ] Test SQL and MongoDB reports pages
- [ ] Verify authentication flows (login/logout/protected routes)

---

## 🚢 Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://shubham-202411066.onrender.com/api
   ```
3. Deploy with "Do not use cache" when changing environment variables
4. Ensure no `localhost` references in `next.config.js` for production

### Render (Backend)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set all backend environment variables (see [Environment Variables](#environment-variables))
4. Set build command:
   ```bash
   npm install
   ```
5. Set start command:
   ```bash
   npx prisma migrate deploy && node server.js
   ```
6. Ensure MongoDB Atlas IP Access List allows `0.0.0.0/0` or Render's egress IPs

---

## 🔧 Troubleshooting

### Frontend: ECONNREFUSED 127.0.0.1:5000

**Problem:** Frontend is pointing to localhost instead of production backend.

**Solution:**
- For development: Set `NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api` in `frontend/.env.local`
- For production: Set `NEXT_PUBLIC_API_URL=https://<your-backend>.onrender.com/api` in Vercel environment variables
- Remove any production rewrites to localhost in `next.config.js`

### Backend: MongoDB Connection Error

**Problem:** Cannot connect to MongoDB Atlas from Render.

**Solution:**
- Add `0.0.0.0/0` to IP Access List in MongoDB Atlas (for testing)
- Ensure `MONGODB_URI` includes the database name
- Verify URL encoding of special characters in password

### Authentication: JWT Errors

**Problem:** Token verification fails or returns errors.

**Solution:**
- Ensure `JWT_SECRET` is set in backend environment variables
- Verify the secret matches between development and production
- Check token expiration settings

### Backend: Database Migration Failures

**Problem:** Prisma migrations fail on deployment.

**Solution:**
- Verify `DATABASE_URL` is correctly formatted
- Ensure PostgreSQL instance is accessible
- Check that database user has sufficient permissions
- Review migration history: `npx prisma migrate status`

---

## 🔒 Security Notes

- **JWT Secret:** Use a strong, random secret and rotate regularly in production
- **Admin Credentials:** Default credentials are for evaluation only. Change immediately in production
- **CORS:** Limit `CORS_ORIGIN` to known domains in production environments
- **Environment Variables:** Never commit `.env` files to version control
- **Database Access:** Use least-privilege principles for database users
- **Password Hashing:** All passwords are hashed using bcrypt before storage
- **API Rate Limiting:** Consider implementing rate limiting for production deployments

---


**Note:** If any hosted URL is temporarily unavailable, a video demo of the full workflow (browsing, cart, checkout, admin) can be provided upon request.
