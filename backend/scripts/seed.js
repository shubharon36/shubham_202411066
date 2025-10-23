require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const Product = require('../models/Product');

const prisma = new PrismaClient();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: adminPassword,
        role: 'admin'
      }
    });
    console.log('✅ Created admin user:', admin.email);

    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'customer@example.com',
        passwordHash: customerPassword,
        role: 'customer'
      }
    });
    console.log('✅ Created customer user:', customer.email);

    // Create sample products
    const products = [
      // Electronics
      {
        sku: 'LAPTOP001',
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop for professionals',
        price: 2499.99,
        category: 'Electronics',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'
      },
      {
        sku: 'PHONE001',
        name: 'iPhone 15 Pro',
        description: 'Latest flagship smartphone',
        price: 1199.99,
        category: 'Electronics',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-2fd86e60236e'
      },
      {
        sku: 'TABLET001',
        name: 'iPad Air',
        description: 'Lightweight and powerful tablet',
        price: 599.99,
        category: 'Electronics',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'
      },
      {
        sku: 'WATCH001',
        name: 'Apple Watch Series 9',
        description: 'Advanced fitness and health tracker',
        price: 429.99,
        category: 'Electronics',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a'
      },
      {
        sku: 'HEADPHONES001',
        name: 'AirPods Max',
        description: 'Premium over-ear headphones',
        price: 549.99,
        category: 'Electronics',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b'
      },

      // Clothing
      {
        sku: 'SHIRT001',
        name: 'Classic White Shirt',
        description: 'Premium cotton dress shirt',
        price: 79.99,
        category: 'Clothing',
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf'
      },
      {
        sku: 'JEANS001',
        name: 'Slim Fit Jeans',
        description: 'Comfortable denim jeans',
        price: 89.99,
        category: 'Clothing',
        stock: 80,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d'
      },
      {
        sku: 'JACKET001',
        name: 'Leather Jacket',
        description: 'Genuine leather biker jacket',
        price: 299.99,
        category: 'Clothing',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5'
      },
      {
        sku: 'DRESS001',
        name: 'Evening Dress',
        description: 'Elegant evening wear',
        price: 159.99,
        category: 'Clothing',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae'
      },

      // Home & Garden
      {
        sku: 'CHAIR001',
        name: 'Ergonomic Office Chair',
        description: 'Comfortable mesh back chair',
        price: 349.99,
        category: 'Home & Garden',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8'
      },
      {
        sku: 'DESK001',
        name: 'Standing Desk',
        description: 'Adjustable height desk',
        price: 499.99,
        category: 'Home & Garden',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c'
      },
      {
        sku: 'LAMP001',
        name: 'LED Desk Lamp',
        description: 'Modern adjustable lamp',
        price: 79.99,
        category: 'Home & Garden',
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c'
      },

      // Sports
      {
        sku: 'YOGA001',
        name: 'Yoga Mat Pro',
        description: 'Non-slip exercise mat',
        price: 39.99,
        category: 'Sports',
        stock: 75,
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'
      },
      {
        sku: 'DUMBBELL001',
        name: 'Adjustable Dumbbells',
        description: 'Set of adjustable weights',
        price: 299.99,
        category: 'Sports',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61'
      },
      {
        sku: 'BIKE001',
        name: 'Mountain Bike',
        description: '21-speed mountain bicycle',
        price: 599.99,
        category: 'Sports',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91'
      },

      // Books
      {
        sku: 'BOOK001',
        name: 'Clean Code',
        description: 'A Handbook of Agile Software Craftsmanship',
        price: 39.99,
        category: 'Books',
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765'
      },
      {
        sku: 'BOOK002',
        name: 'Design Patterns',
        description: 'Elements of Reusable Object-Oriented Software',
        price: 44.99,
        category: 'Books',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create a sample order
    const sampleOrder = await prisma.order.create({
      data: {
        userId: customer.id,
        total: 2699.98,
        status: 'completed',
        orderItems: {
          create: [
            {
              productId: createdProducts[0]._id.toString(),
              quantity: 1,
              priceAtPurchase: 2499.99
            },
            {
              productId: createdProducts[5]._id.toString(),
              quantity: 2,
              priceAtPurchase: 99.99
            }
          ]
        }
      }
    });
    console.log('✅ Created sample order');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Sample credentials:');
    console.log('Admin - Email: admin@example.com | Password: admin123');
    console.log('Customer - Email: customer@example.com | Password: customer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedData();