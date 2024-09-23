const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to the cart
router.post('/cart/add', async (req, res) => {
  const { productId, variant, quantity } = req.body;

  try {
    let cart = await Cart.findOne(); // In production, link the cart to a user
    if (!cart) {
      cart = new Cart();
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingItem = cart.items.find(item => item.productId.equals(productId) && item.variant === variant);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        variant,
        quantity,
      });
    }

    // Recalculate total quantity and price
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((acc, item) => {
      const productVariant = product.variants.find(v => v.color === item.variant);
      return acc + (productVariant.price * item.quantity);
    }, 0);

    await cart.save();
    res.json(cart);

  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart
router.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove item from cart
router.post('/cart/remove', async (req, res) => {
  const { productId, variant } = req.body;

  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => !(item.productId.equals(productId) && item.variant === variant));

    // Recalculate total quantity and price
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
