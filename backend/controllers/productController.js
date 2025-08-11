// Get product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('companyId');
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProductsByCompany = async (req, res) => {
  try {
    const products = await Product.find({ companyId: req.params.companyId });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res) => {
  try {
    // If images is not present but image is, convert image to images array
    let body = { ...req.body };
    if (!body.images && body.image) {
      body.images = [body.image];
    }
    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let body = { ...req.body };
    if (!body.images && body.image) {
      body.images = [body.image];
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
