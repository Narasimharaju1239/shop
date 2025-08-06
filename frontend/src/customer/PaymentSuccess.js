import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [countdown, setCountdown] = useState(10);

  // Get query parameters
  const urlParams = new URLSearchParams(location.search);
  const txnid = urlParams.get('txnid');
  const orderId = urlParams.get('orderId');
  const amount = urlParams.get('amount');

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/customer/orders');
    }
  }, [countdown, navigate]);

  return (
    <div style={{
      background: currentTheme.background,
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: currentTheme.card,
        borderRadius: '12px',
        padding: '40px',
        boxShadow: `0 4px 20px ${currentTheme.shadow}`,
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          color: '#4caf50'
        }}>
          ✅
        </div>

        <h1 style={{
          color: '#4caf50',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '10px'
        }}>
          Payment Successful!
        </h1>

        <p style={{
          color: currentTheme.text,
          fontSize: '18px',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Your payment has been processed successfully. Your order is confirmed!
        </p>

        {/* Payment Details */}
        <div style={{
          background: '#e8f5e8',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{
            color: '#4caf50',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            Payment Details
          </h3>
          
          {txnid && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Transaction ID:</span>
              <div style={{ color: currentTheme.text, fontWeight: '600', fontSize: '16px' }}>
                {txnid}
              </div>
            </div>
          )}
          
          {orderId && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Order ID:</span>
              <div style={{ color: currentTheme.text, fontWeight: '600', fontSize: '16px' }}>
                #{orderId}
              </div>
            </div>
          )}
          
          {amount && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Amount Paid:</span>
              <div style={{ color: '#4caf50', fontWeight: '700', fontSize: '24px' }}>
                ₹{parseFloat(amount).toLocaleString('en-IN')}
              </div>
            </div>
          )}
          
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Payment Method:</span>
            <div style={{ color: currentTheme.text, fontWeight: '600', fontSize: '16px' }}>
              PayU Gateway
            </div>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Status:</span>
            <div style={{
              display: 'inline-block',
              background: '#4caf50',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              marginTop: '4px'
            }}>
              Confirmed
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div style={{
          background: '#e8f5e8',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h4 style={{
            color: '#4caf50',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            🎉 Order Confirmed!
          </h4>
          <div style={{ color: currentTheme.text, fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ margin: '8px 0' }}>
              • Your payment has been received and verified
            </p>
            <p style={{ margin: '8px 0' }}>
              • Your order is now confirmed and will be processed shortly
            </p>
            <p style={{ margin: '8px 0' }}>
              • You will receive updates on order status
            </p>
            <p style={{ margin: '8px 0' }}>
              • A confirmation email has been sent to your email address
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => navigate('/customer/orders')}
            style={{
              background: currentTheme.primary,
              color: currentTheme.buttonText,
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.shadow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate('/customer/products')}
            style={{
              background: 'transparent',
              color: currentTheme.primary,
              border: `2px solid ${currentTheme.primary}`,
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = currentTheme.primary;
              e.currentTarget.style.color = currentTheme.buttonText;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = currentTheme.primary;
            }}
          >
            Continue Shopping
          </button>
        </div>

        {/* Auto-redirect Notice */}
        <div style={{
          color: currentTheme.textSecondary,
          fontSize: '14px',
          fontStyle: 'italic'
        }}>
          You will be automatically redirected to your orders in {countdown} seconds...
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
