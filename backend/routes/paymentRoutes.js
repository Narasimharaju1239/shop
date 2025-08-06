const express = require('express');
const router = express.Router();
const paymentGateway = require('../utils/paymentGateway');
const { protect } = require('../middleware/authMiddleware');

// Get payment configuration
router.get('/config', (req, res) => {
  try {
    const config = paymentGateway.getPaymentConfig();
    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Payment config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment configuration'
    });
  }
});

// Generate UPI payment URL
router.post('/upi/generate', protect, (req, res) => {
  try {
    const { amount, orderId, customerName } = req.body;
    
    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and order ID are required'
      });
    }

    const upiUrl = paymentGateway.generateUpiUrl(amount, orderId, customerName);
    
    res.json({
      success: true,
      upiUrl,
      upiId: process.env.UPI_ID,
      merchantName: process.env.MERCHANT_NAME,
      amount,
      orderId
    });
  } catch (error) {
    console.error('UPI URL generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate UPI payment URL'
    });
  }
});

// Create Razorpay order
router.post('/razorpay/create', protect, async (req, res) => {
  try {
    const { amount, orderId, customerDetails } = req.body;
    
    if (!amount || !orderId || !customerDetails) {
      return res.status(400).json({
        success: false,
        message: 'Amount, order ID, and customer details are required'
      });
    }

    const result = await paymentGateway.createRazorpayOrder(amount, orderId, customerDetails);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order'
    });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', protect, (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID, order ID, and signature are required'
      });
    }

    const isValid = paymentGateway.verifyRazorpayPayment(paymentId, orderId, signature);
    
    res.json({
      success: true,
      isValid,
      message: isValid ? 'Payment verified successfully' : 'Payment verification failed'
    });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
});

// Generate PayU payment hash
router.post('/payu/generate', protect, (req, res) => {
  try {
    const { amount, orderId, customerDetails } = req.body;
    
    if (!amount || !orderId || !customerDetails) {
      return res.status(400).json({
        success: false,
        message: 'Amount, order ID, and customer details are required'
      });
    }

    const result = paymentGateway.generatePayUHash(amount, orderId, customerDetails);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('PayU hash generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PayU payment hash'
    });
  }
});

// PayU success callback
router.post('/payu/success', (req, res) => {
  try {
    console.log('PayU Success Callback:', req.body);
    // Handle successful payment
    // Update order status in database
    res.redirect(`${process.env.FRONTEND_URL}/customer/payment-success?status=success&txnid=${req.body.txnid}`);
  } catch (error) {
    console.error('PayU success callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/customer/payment-failed?status=error`);
  }
});

// PayU failure callback
router.post('/payu/failure', (req, res) => {
  try {
    console.log('PayU Failure Callback:', req.body);
    // Handle failed payment
    res.redirect(`${process.env.FRONTEND_URL}/customer/payment-failed?status=failed&txnid=${req.body.txnid}`);
  } catch (error) {
    console.error('PayU failure callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/customer/payment-failed?status=error`);
  }
});

// Create PhonePe payment
router.post('/phonepe/create', protect, async (req, res) => {
  try {
    const { amount, orderId, customerDetails } = req.body;
    
    if (!amount || !orderId || !customerDetails) {
      return res.status(400).json({
        success: false,
        message: 'Amount, order ID, and customer details are required'
      });
    }

    const result = await paymentGateway.createPhonePePayment(amount, orderId, customerDetails);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('PhonePe payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PhonePe payment'
    });
  }
});

// PhonePe callback
router.post('/phonepe/callback', (req, res) => {
  try {
    console.log('PhonePe Callback:', req.body);
    // Handle PhonePe callback
    // Verify payment status and update order
    res.json({ success: true });
  } catch (error) {
    console.error('PhonePe callback error:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
