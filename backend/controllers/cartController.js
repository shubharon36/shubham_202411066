const Product = require('../models/Product');
const { carts, getCartForUser, setCartForUser, clearCartForUser } = require('../stores/cartStore');

// Treat missing/NaN stock as "very large" so new products without explicit stock don't block adds.
function getAvailableStock(product) {
  const n = Number(product?.stock);
  return Number.isFinite(n) && n >= 0 ? n : 1e9;
}

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = getCartForUser(userId);

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          product: product ? {
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock
          } : null
        };
      })
    );

    const total = populatedItems.reduce((sum, it) => {
      return sum + (it.product ? Number(it.product.price || 0) * Number(it.quantity || 0) : 0);
    }, 0);

    res.json({ items: populatedItems, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId || Number(quantity) < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const available = getAvailableStock(product);
    if (available < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const cart = getCartForUser(userId);
    const idx = cart.items.findIndex((it) => it.productId === productId);
    if (idx > -1) cart.items[idx].quantity += quantity;
    else cart.items.push({ productId, quantity });

    setCartForUser(userId, cart);
    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (!productId || Number(quantity) < 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const cart = getCartForUser(userId);
    const idx = cart.items.findIndex((it) => it.productId === productId);
    if (idx === -1) return res.status(404).json({ error: 'Item not in cart' });

    if (Number(quantity) === 0) {
      cart.items.splice(idx, 1);
    } else {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      const available = getAvailableStock(product);
      if (available < quantity) return res.status(400).json({ error: 'Insufficient stock' });
      cart.items[idx].quantity = quantity;
    }

    setCartForUser(userId, cart);
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = getCartForUser(userId);
    cart.items = cart.items.filter((it) => it.productId !== productId);
    setCartForUser(userId, cart);

    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    clearCartForUser(userId);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
