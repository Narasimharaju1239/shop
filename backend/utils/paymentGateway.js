// Dummy paymentGateway module to prevent MODULE_NOT_FOUND error
module.exports = {
  getPaymentConfig: () => ({
    provider: 'dummy',
    upiId: process.env.UPI_ID || 'test@upi',
    currency: 'INR'
  }),
  generateUpiUrl: (amount, orderId, customerName) => {
    // Return a dummy UPI URL
    return `upi://pay?pa=test@upi&pn=${encodeURIComponent(customerName || 'Test')}&am=${amount}&cu=INR&tn=Order${orderId}`;
  }
};
