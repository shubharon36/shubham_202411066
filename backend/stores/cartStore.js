// Simple in-memory cart store shared between controllers.
// In production, swap this for Redis or a DB-backed cart.
const carts = new Map(); // key: userId, value: { items: [{ productId, quantity }] }

function getCartForUser(userId) {
  return carts.get(userId) || { items: [] };
}

function setCartForUser(userId, cart) {
  carts.set(userId, cart);
}

function clearCartForUser(userId) {
  carts.delete(userId);
}

module.exports = { carts, getCartForUser, setCartForUser, clearCartForUser };
