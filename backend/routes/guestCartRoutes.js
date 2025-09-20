const express = require('express');
const router = express.Router();
const GuestCart = require('../models/GuestCart');
const Product = require('../models/Product');

// Get guest cart
router.get('/:guestId', async (req, res) => {
  try {
    const cart = await GuestCart.findOne({ guestId: req.params.guestId }).populate('items.product');
    res.json(cart || { guestId: req.params.guestId, items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guest cart' });
  }
});

// Add item to guest cart
router.post('/add', async (req, res) => {
  const { guestId, productId, quantity = 1 } = req.body;
  if (!guestId || !productId) return res.status(400).json({ error: 'guestId and productId required' });
  try {
    let cart = await GuestCart.findOne({ guestId });
    if (!cart) {
      cart = new GuestCart({ guestId, items: [] });
    }
    const existing = cart.items.find(item => item.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to guest cart' });
  }
});

// Remove item from guest cart
router.post('/remove', async (req, res) => {
  const { guestId, productId } = req.body;
  if (!guestId || !productId) return res.status(400).json({ error: 'guestId and productId required' });
  try {
    const cart = await GuestCart.findOne({ guestId });
    if (!cart) return res.json({ guestId, items: [] });
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from guest cart' });
  }
});

// Clear guest cart
router.post('/clear', async (req, res) => {
  const { guestId } = req.body;
  if (!guestId) return res.status(400).json({ error: 'guestId required' });
  try {
    const cart = await GuestCart.findOne({ guestId });
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date();
      await cart.save();
    }
    res.json({ guestId, items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear guest cart' });
  }
});

module.exports = router;
