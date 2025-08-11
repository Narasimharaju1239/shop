// Remove avatar
exports.removeAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId, { image: '' }, { new: true });
    res.json({ message: 'Avatar removed', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove avatar' });
  }
};
const path = require('path');

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Save image path to user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { image: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');
    res.json({ imageUrl: user.image, user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
