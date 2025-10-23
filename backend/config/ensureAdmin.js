const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Ensures there's at least one admin user.
 * Uses ADMIN_EMAIL/ADMIN_PASSWORD once; no self-elevation from client.
 */
async function ensureAdminUser() {
  const adminCount = await prisma.user.count({ where: { role: 'admin' } });
  if (adminCount > 0) return;

  const email = process.env.ADMIN_EMAIL || 'admin@shophub.local';
  const name = process.env.ADMIN_NAME || 'Site Admin';
  const pass = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(pass, 10);

  await prisma.user.create({
    data: { email, name, passwordHash, role: 'admin' },
  });

  console.log('✔ Seeded initial admin user:', email);
}

module.exports = { ensureAdminUser };
