const crypto = require('crypto');

class PaymentGateway {
  constructor() {
    this.razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    this.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    this.payuMerchantKey = process.env.PAYU_MERCHANT_KEY;
    this.payuMerchantSalt = process.env.PAYU_MERCHANT_SALT;
    this.upiId = process.env.UPI_ID || '8819859999@ibl';
    this.merchantName = process.env.MERCHANT_NAME || 'Shop Eluru';
  }

  // Generate UPI Payment URL (Current Method)
  generateUpiUrl(amount, orderId, customerName = 'Customer') {
    const transactionNote = `Order #${orderId}`;
    const upiUrl = `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(this.merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
    return upiUrl;
  }

  // Razorpay Integration
  async createRazorpayOrder(amount, orderId, customerDetails) {
    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: this.razorpayKeyId,
        key_secret: this.razorpayKeySecret
      });

      const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `order_${orderId}`,
        notes: {
          orderId: orderId,
          customerName: customerDetails.name,
          customerPhone: customerDetails.phone
        }
      };

      const order = await razorpay.orders.create(options);
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: this.razorpayKeyId
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify Razorpay Payment
  verifyRazorpayPayment(paymentId, orderId, signature) {
    try {
      const body = paymentId + "|" + orderId;
      const expectedSignature = crypto
        .createHmac('sha256', this.razorpayKeySecret)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Razorpay verification failed:', error);
      return false;
    }
  }

  // PayU Integration
  generatePayUHash(amount, orderId, customerDetails) {
    try {
      const { name, email, phone } = customerDetails;
      const txnid = `txn_${orderId}_${Date.now()}`;
      const productinfo = `Order #${orderId}`;
      
      // PayU hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
      const hashString = `${this.payuMerchantKey}|${txnid}|${amount}|${productinfo}|${name}|${email}|||||||||||${this.payuMerchantSalt}`;
      const hash = crypto.createHash('sha512').update(hashString).digest('hex');

      return {
        success: true,
        txnid,
        hash,
        key: this.payuMerchantKey,
        amount,
        productinfo,
        firstname: name,
        email,
        phone,
        surl: `${process.env.BASE_URL}/api/payments/payu/success`,
        furl: `${process.env.BASE_URL}/api/payments/payu/failure`
      };
    } catch (error) {
      console.error('PayU hash generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // PhonePe Business Integration
  async createPhonePePayment(amount, orderId, customerDetails) {
    try {
      const merchantTransactionId = `MT${Date.now()}${orderId}`;
      const payload = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        merchantTransactionId,
        merchantUserId: `USER_${customerDetails.phone}`,
        amount: amount * 100, // Amount in paise
        redirectUrl: `${process.env.BASE_URL}/api/payments/phonepe/callback`,
        redirectMode: "POST",
        callbackUrl: `${process.env.BASE_URL}/api/payments/phonepe/callback`,
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const endpoint = '/pg/v1/pay';
      const saltKey = process.env.PHONEPE_SALT_KEY;
      const saltIndex = 1;
      
      const string = base64Payload + endpoint + saltKey;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + saltIndex;

      return {
        success: true,
        payload: base64Payload,
        checksum,
        merchantTransactionId,
        url: process.env.PHONEPE_MODE === 'test' 
          ? 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
          : 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
      };
    } catch (error) {
      console.error('PhonePe payment creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get Payment Gateway Configuration for Frontend
  getPaymentConfig() {
    return {
      upi: {
        enabled: true,
        upiId: this.upiId,
        merchantName: this.merchantName
      },
      razorpay: {
        enabled: !!this.razorpayKeyId,
        keyId: this.razorpayKeyId
      },
      payu: {
        enabled: !!this.payuMerchantKey,
        merchantKey: this.payuMerchantKey,
        mode: process.env.PAYU_MODE || 'test'
      },
      phonepe: {
        enabled: !!process.env.PHONEPE_MERCHANT_ID,
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        mode: process.env.PHONEPE_MODE || 'test'
      }
    };
  }
}

module.exports = new PaymentGateway();
