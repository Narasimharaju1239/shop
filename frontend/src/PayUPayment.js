import React, { useState } from 'react';
import axios from 'axios';

const PayUPayment = ({ orderId, amount, customer }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayU = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/payments/payu/initiate', {
        orderId,
        amount,
        customerData: customer,
        orderDescription: `Payment for Order #${orderId}`
      });
      if (res.data.success && res.data.paymentData) {
        // Create a form and submit to PayU
        const form = document.createElement('form');
        form.action = res.data.paymentData.paymentUrl;
        form.method = 'POST';
        // Mandatory PayU fields
        const requiredFields = [
          'key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'phone', 'surl', 'furl', 'hash'
        ];
        requiredFields.forEach(field => {
          if (res.data.paymentData[field]) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field;
            input.value = res.data.paymentData[field];
            form.appendChild(input);
          }
        });
        // Add any extra fields except paymentUrl and success
        Object.entries(res.data.paymentData).forEach(([key, value]) => {
          if (!requiredFields.includes(key) && key !== 'paymentUrl' && key !== 'success') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
          }
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        setError(res.data.message || 'Payment initiation failed');
      }
    } catch (err) {
      setError('Payment initiation error');
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePayU} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with PayU'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default PayUPayment;
