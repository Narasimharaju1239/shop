const crypto = require('crypto');

class PayUService {
  constructor() {
    this.merchantKey = process.env.PAYU_MERCHANT_KEY;
    this.merchantSalt = process.env.PAYU_MERCHANT_SALT;
    this.mode = process.env.PAYU_MODE || 'test';
    this.baseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in';
  }

  // Generate PayU payment hash
  generatePaymentHash(paymentData) {
    const {
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = ''
    } = paymentData;

    try {
      // PayU hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
      const hashString = `${this.merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${this.merchantSalt}`;
      
      const hash = crypto.createHash('sha512').update(hashString).digest('hex');
      
      return {
        success: true,
        hash,
        hashString, // For debugging
        key: this.merchantKey,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone: paymentData.phone || '',
        surl: `${process.env.BASE_URL}/api/payments/payu/success`,
        furl: `${process.env.BASE_URL}/api/payments/payu/failure`,
        service_provider: 'payu_paisa',
        paymentUrl: `${this.baseUrl}/_payment`
      };
    } catch (error) {
      console.error('PayU hash generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify PayU payment response
  verifyPaymentResponse(responseData) {
    try {
      const {
        status,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        hash,
        udf1 = '',
        udf2 = '',
        udf3 = '',
        udf4 = '',
        udf5 = ''
      } = responseData;

      // Generate hash for verification
      const hashString = `${this.merchantSalt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${this.merchantKey}`;
      
      const expectedHash = crypto.createHash('sha512').update(hashString).digest('hex');
      
      const isValid = expectedHash.toLowerCase() === hash.toLowerCase();
      
      return {
        success: true,
        isValid,
        status,
        txnid,
        amount,
        message: isValid ? 'Payment verification successful' : 'Payment verification failed'
      };
    } catch (error) {
      console.error('PayU verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate transaction ID
  generateTransactionId(orderId) {
    const timestamp = Date.now();
    return `TXN_${orderId}_${timestamp}`;
  }

  // Prepare payment data for frontend
  preparePaymentData(orderData, customerData) {
    try {
      const txnid = this.generateTransactionId(orderData.orderId);
      const amount = parseFloat(orderData.amount).toFixed(2);
      const productinfo = `Order #${orderData.orderId} - ${orderData.description || 'Shop Eluru Purchase'}`;
      
      const paymentData = {
        txnid,
        amount,
        productinfo,
        firstname: customerData.name || customerData.firstname,
        email: customerData.email,
        phone: customerData.phone,
        udf1: orderData.orderId.toString(),
        udf2: customerData.address || '',
        udf3: customerData.city || '',
        udf4: customerData.state || '',
        udf5: customerData.pincode || ''
      };

      return this.generatePaymentHash(paymentData);
    } catch (error) {
      console.error('PayU payment data preparation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get PayU configuration for frontend
  getPayUConfig() {
    return {
      merchantKey: this.merchantKey,
      baseUrl: this.baseUrl,
      mode: this.mode,
      paymentUrl: `${this.baseUrl}/_payment`
    };
  }
}

module.exports = new PayUService();
