// scripts/seed-admin.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: { name, email, passwordHash, role: 'admin' },
    });
    console.log('✅ Admin created:');
    console.log('   email   :', email);
    console.log('   password:', password);
  } else {
    // ensure it's an admin
    if (user.role !== 'admin') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' },
      });
      console.log(`✅ Existing user ${email} promoted to admin`);
    } else {
      console.log(`ℹ️ Admin already exists: ${email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('Seed admin failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
