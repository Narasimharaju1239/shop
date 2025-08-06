const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
