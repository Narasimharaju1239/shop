const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      // Do NOT create a new cart here!
      return res.json({ items: [] });
    }
    res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
};

// Add or update item in cart
exports.addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await cart.populate('items.product');
    res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
    res.json({ items: cart.items });
  } catch (err) {
    next(err);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      // If no cart exists, return empty items array
      return res.json({ items: [] });
    }
    cart.items = [];
    await cart.save();
    res.json({ items: [] });
  } catch (err) {
    next(err);
  }
};

