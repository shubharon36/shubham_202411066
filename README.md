
# ShopHub – Full-Stack E-Commerce (MVC, SQL + MongoDB)

> *Note: If any hosted URL is temporarily unavailable, I can provide a short video demo of the full workflow (browsing, cart, checkout, admin) on request.*

## Overview

ShopHub is a production-ready, full-stack e-commerce web application that demonstrates a clean MVC backend with a modern Next.js frontend.

It implements authentication (JWT), product catalog (MongoDB), transactional orders (PostgreSQL via Prisma), cart & checkout, and admin product management.

The app also includes server-side sorting logic, and two analytics reports (one SQL aggregation and one MongoDB aggregation).

## Key Features

* **Auth (JWT + bcrypt):** register, login, logout; roles: admin, customer
* **Products (MongoDB):** CRUD for admins, search, category filter, pagination
* **Server-side sorting:** default price DESC; can be overridden by `?sortOrder=asc` or header `x-sort-order: asc`
* **Cart & Checkout:** add/update/remove items; server-calculated totals; order creation persists to SQL
* **Orders (PostgreSQL + Prisma):** order header + order items; admin or customer scopes
* **Reports:**
    * SQL aggregation (e.g., daily revenue)
    * MongoDB aggregation (e.g., category-wise sales)
* **Responsive UI (Next.js App Router)** with protected Admin pages
* **Deployed:** Frontend on Vercel, Backend on Render

## Tech Stack

### Frontend

* Next.js 15+ (App Router, TypeScript)
* CSS Modules (and small utility classes)
* Context-based auth & cart state

### Backend

* Node.js, Express (MVC)
* PostgreSQL (orders, order_items)
* Prisma ORM
* MongoDB / Mongoose (products)
* JWT (jsonwebtoken) + bcrypt

### Testing

* Jest + Supertest for backend (API-level tests)
* Lightweight manual QA checklist for UI

## Live Deployments

* **Frontend (Vercel):** [https://shubham-202411066.vercel.app](https://shubham-202411066.vercel.app)
* **(or current preview):** [https://shubham-202411066-git-main-shubharon36s-projects.vercel.app/](https://shubham-202411066-git-main-shubharon36s-projects.vercel.app/)
* **Backend (Render):**
    * **Base:** [https://shubham-202411066.onrender.com](https://shubham-202411066.onrender.com)
    * **API Base:** [https://shubham-202411066.onrender.com/api](https://shubham-202411066.onrender.com/api)
    * **Health:** [https://shubham-202411066.onrender.com/health](https://shubham-202411066.onrender.com/health)

The frontend reads the API base from `NEXT_PUBLIC_API_URL`.

## Admin Login (for Evaluation)

* **Email:** `admin@shophub.local`
* **Password:** `admin123`

The admin account is auto-seeded on boot (if not present).

You can change these via env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.

## Project Structure

.
├─ backend/                 # Node/Express, MVC
│  ├─ config/               # Mongo, Prisma, admin seeding
│  ├─ controllers/          # auth, product, cart, order, report
│  ├─ middleware/           # authenticate, authorize
│  ├─ models/               # Mongoose models (Product)
│  ├─ prisma/               # Prisma schema & migrations (orders, items, users)
│  ├─ routes/               # Express routes per domain
│  ├─ server.js             # App bootstrap
│  └─ package.json
└─ frontend/                # Next.js (App Router)
   ├─ src/app/              # routes, components, contexts
   │  ├─ (main)/            # store-facing pages (products, cart, checkout)
   │  ├─ (auth)/            # login, register
   │  ├─ admin/             # admin-only pages
   │  ├─ lib/               # api helper, utilities
   │  └─ styles/            # CSS Modules
   └─ package.json

Local Setup
Prerequisites
Node.js 18+ (22 is fine)

npm (or pnpm)

PostgreSQL instance

MongoDB (local or Atlas cluster)

1) Clone
Bash

git clone https://github.com/<you>/<repo>.git
cd <repo>
2) Backend – Install & Environment
Bash

cd backend
npm install
Create backend/.env:

Ini, TOML

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

# Admin seed (optional; defaults used if missing)
ADMIN_EMAIL="admin@shophub.local"
ADMIN_PASSWORD="Admin@12345"
ADMIN_NAME="Shop Admin"
3) Backend – Migrate (Prisma) & Run
Bash

# Apply SQL schema locally
npx prisma migrate dev

# Start backend
npm run dev
# or: npm start
4) Frontend – Install & Environment
Bash

cd ../frontend
npm install
Create frontend/.env.local:


# Always include /api at the end
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api
5) Frontend – Run
Bash

npm run dev
# open http://localhost:3000
Environment Variables (Production)
Backend (Render)

PORT=5000
NODE_ENV=production
DATABASE_URL=<your Render PostgreSQL URL>
MONGODB_URI=<your MongoDB Atlas SRV connection string + db name>
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=https://shubham-202411066.vercel.app
ADMIN_EMAIL=admin@shophub.local
ADMIN_PASSWORD=admin123
ADMIN_NAME=Shop Admin
Frontend (Vercel)

NEXT_PUBLIC_API_URL=https://shubham-202411066.onrender.com/api
Important: The frontend must not call localhost in production.

Ensure you have no rewrites to localhost in next.config.js for production.

Database Configuration & Migrations
SQL (PostgreSQL via Prisma)
Entities: users, orders, order_items

Apply migrations locally:


cd backend
npx prisma migrate dev
On Render (deploy hook):


npx prisma migrate deploy && node server.js
MongoDB (Products)
Collection: products

Indexed for search:

name, description text index

category + price index for common queries

Atlas connection string example:

mongodb+srv://<user>:<URL_ENCODED_PASSWORD>@cluster0.xxxxx.mongodb.net/ecommerce_products?retryWrites=true&w=majority&appName=Cluster0
Testing
Backend (Jest + Supertest)
Assuming Jest is installed in backend/devDependencies:


cd backend
npm test
Typical tests cover:

Auth (register/login/profile)

Product listing filters & server-side sorting

Cart lifecycle (add/update/remove)

Order creation (stock checks, totals, persistence)

If you don’t see a test script, you can add one in backend/package.json:

JSON

"scripts": {
  "test": "jest --runInBand"
}
Manual QA (UI)
Browse /products → filter by category/search → verify server-sorted results.

Add items to cart → update quantities → ensure totals update.

Checkout → see new order in SQL.

Admin → /admin/products → create/update/delete product, then verify on storefront.

Try SQL & Mongo reports pages.

API Summary
Base URL: /api

Auth
POST /auth/register – { name, email, password } → JWT + user

POST /auth/login – { email, password } → JWT + user

GET /auth/profile – (Bearer token) → user profile

Products (MongoDB)
GET /products – query params:

page (default 1), limit (default 10)

category

search (text search on name/description)

Server-side sort:

default: price desc

override: ?sortOrder=asc or header x-sort-order: asc

GET /products/categories – list of categories

GET /products/:id – product detail

Admin only:

POST /products – create

PUT /products/:id – update

DELETE /products/:id – delete

Cart
(Authenticated)

GET /cart – current user’s cart

POST /cart/add – { productId, quantity }

PUT /cart/update – { productId, quantity } (0 removes)

DELETE /cart/:productId – remove one item

DELETE /cart – clear all

Orders (PostgreSQL)
(Authenticated)

POST /orders – { items: [{ productId, quantity }] }

Server validates stock and prices, calculates totals, persists order + order_items, decrements stock

GET /orders – customer sees own orders; admin sees all

GET /orders/:id – details

PUT /orders/:id/status – admin only status ∈ { pending, completed, cancelled }

Reports
GET /reports/sql/daily-revenue – SQL aggregation

GET /reports/mongo/category-sales – Mongo aggregation

Frontend Routes
/ – Landing

/products – Catalog (search, filters, pagination, server-sorted)

/products/[id] – Product detail

/cart – Cart page

/checkout – Checkout page (auth modal if not logged in)

/orders/success – Thank-you page

/login & /register

/admin/products – Admin product CRUD (admin-only)

Deployment Notes
Vercel (Frontend)
Set NEXT_PUBLIC_API_URL to your Render API base with /api suffix

e.g., https://<your-backend>.onrender.com/api

Redeploy with “Do not use cache” when changing env vars.

Render (Backend)
Add all backend env vars (see above)

Start command:

npx prisma migrate deploy && node server.js
Ensure your MongoDB Atlas IP Access List allows 0.0.0.0/0 (or the Render egress IPs).

Troubleshooting
Vercel “ECONNREFUSED 127.0.0.1:5000”

Your frontend is still pointing to localhost.

Fix: In frontend/.env.local for dev OR in Vercel env for prod, set NEXT_PUBLIC_API_URL to your public backend URL (https://…onrender.com/api). Remove production rewrites to localhost in next.config.js.

MongoDB connection error on Render

Allow public IPs in Atlas (0.0.0.0/0 for testing) and ensure MONGODB_URI includes the database name.

JWT errors

Make sure JWT_SECRET is set on the backend.

Security & Notes
JWT secret should be strong and rotated for production.

Admin credentials are for evaluation. Change them in production environments.

CORS should be limited to known origins in production.
