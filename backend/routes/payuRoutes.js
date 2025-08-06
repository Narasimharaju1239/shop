const express = require('express');
const router = express.Router();
const payuService = require('../utils/payuService');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

// Get PayU configuration
router.get('/config', (req, res) => {
  try {
    const config = payuService.getPayUConfig();
    res.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('PayU config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get PayU configuration'
    });
  }
});

// Initiate PayU payment
router.post('/initiate', protect, async (req, res) => {
  try {
    const { orderId, amount, customerData, orderDescription } = req.body;
    
    if (!orderId || !amount || !customerData) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, amount, and customer data are required'
      });
    }

    // Validate customer data
    if (!customerData.name || !customerData.email || !customerData.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and phone are required'
      });
    }

    const orderData = {
      orderId,
      amount,
      description: orderDescription || `Payment for Order #${orderId}`
    };

    const paymentData = payuService.preparePaymentData(orderData, customerData);
    
    if (paymentData.success) {
      res.json({
        success: true,
        paymentData,
        message: 'Payment initiated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: paymentData.error || 'Failed to initiate payment'
      });
    }
  } catch (error) {
    console.error('PayU payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate PayU payment'
    });
  }
});

// PayU success callback
router.post('/success', async (req, res) => {
  try {
    console.log('PayU Success Callback Data:', req.body);
    
    const verification = payuService.verifyPaymentResponse(req.body);
    
    if (verification.success && verification.isValid) {
      const { txnid, status, amount, udf1: orderId } = req.body;
      
      // Update order status in database
      if (orderId) {
        try {
          await Order.findByIdAndUpdate(orderId, {
            status: 'confirmed',
            paymentStatus: 'completed',
            paymentDetails: {
              gateway: 'payu',
              transactionId: txnid,
              amount: parseFloat(amount),
              status: status,
              paidAt: new Date()
            }
          });
          
          console.log(`Order ${orderId} updated successfully after PayU payment`);
        } catch (dbError) {
          console.error('Database update error:', dbError);
        }
      }
      
      // Redirect to success page
      res.redirect(`${process.env.FRONTEND_URL}/customer/payment-success?status=success&txnid=${txnid}&orderId=${orderId}&amount=${amount}`);
    } else {
      console.error('PayU payment verification failed:', verification);
      res.redirect(`${process.env.FRONTEND_URL}/customer/payment-failed?status=verification_failed&txnid=${req.body.txnid}`);
    }
  } catch (error) {
    console.error('PayU success callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/customer/payment-failed?status=error&message=callback_error`);
  }
});

// PayU failure callback
router.post('/failure', async (req, res) => {
  try {
    console.log('PayU Failure Callback Data:', req.body);
    
    const { txnid, status, error_Message, udf1: orderId } = req.body;
    
    // Update order status in database
    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          status: 'cancelled',
          paymentStatus: 'failed',
          paymentDetails: {
            gateway: 'payu',
            transactionId: txnid,
            status: status,
            error: error_Message,
            failedAt: new Date()
          }
        });
        
        console.log(`Order ${orderId} marked as failed after PayU payment failure`);
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
    }
    
    // Redirect to failure page
    res.redirect(`${process.env.FRONTEND_URL}/customer/payment-failed?status=failed&txnid=${txnid}&orderId=${orderId}&error=${encodeURIComponent(error_Message || 'Payment failed')}`);
  } catch (error) {
    console.error('PayU failure callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/customer/payment-failed?status=error&message=callback_error`);
  }
});

// Verify payment status (for frontend polling)
router.post('/verify', protect, async (req, res) => {
  try {
    const { txnid, orderId } = req.body;
    
    if (!txnid && !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID or Order ID is required'
      });
    }
    
    // Check order status in database
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentDetails: order.paymentDetails
      }
    });
  } catch (error) {
    console.error('PayU verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
});

module.exports = router;
