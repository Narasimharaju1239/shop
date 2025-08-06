import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [countdown, setCountdown] = useState(15);

  // Get query parameters
  const urlParams = new URLSearchParams(location.search);
  const status = urlParams.get('status');
  const txnid = urlParams.get('txnid');
  const orderId = urlParams.get('orderId');
  const error = urlParams.get('error');

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/customer/checkout');
    }
  }, [countdown, navigate]);

  const getStatusMessage = () => {
    switch (status) {
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          icon: '❌',
          color: '#f44336'
        };
      case 'verification_failed':
        return {
          title: 'Payment Verification Failed',
          message: 'Payment verification failed. Please contact support if amount was deducted.',
          icon: '⚠️',
          color: '#ff9800'
        };
      case 'cancelled':
        return {
          title: 'Payment Cancelled',
          message: 'You cancelled the payment. Your order has not been placed.',
          icon: '🚫',
          color: '#ff9800'
        };
      default:
        return {
          title: 'Payment Error',
          message: 'An error occurred during payment processing.',
          icon: '❌',
          color: '#f44336'
        };
    }
  };

  const statusInfo = getStatusMessage();

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
        {/* Failure Icon */}
        <div style={{
          fontSize: '80px',
          marginBottom: '20px'
        }}>
          {statusInfo.icon}
        </div>

        <h1 style={{
          color: statusInfo.color,
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '10px'
        }}>
          {statusInfo.title}
        </h1>

        <p style={{
          color: currentTheme.text,
          fontSize: '18px',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          {statusInfo.message}
        </p>

        {/* Payment Details */}
        {(txnid || orderId || error) && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{
              color: '#f44336',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              Transaction Details
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
            
            {error && (
              <div style={{ marginBottom: '10px' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Error:</span>
                <div style={{ color: '#f44336', fontWeight: '600', fontSize: '14px' }}>
                  {decodeURIComponent(error)}
                </div>
              </div>
            )}
            
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Status:</span>
              <div style={{
                display: 'inline-block',
                background: statusInfo.color,
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '4px'
              }}>
                {status === 'failed' ? 'Failed' : status === 'cancelled' ? 'Cancelled' : 'Error'}
              </div>
            </div>
          </div>
        )}

        {/* What to do next */}
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h4 style={{
            color: '#856404',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            💡 What to do next?
          </h4>
          <div style={{ color: '#856404', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ margin: '8px 0' }}>
              • <strong>Try again:</strong> Go back to checkout and retry payment
            </p>
            <p style={{ margin: '8px 0' }}>
              • <strong>Different payment method:</strong> Use UPI, card, or net banking
            </p>
            <p style={{ margin: '8px 0' }}>
              • <strong>Check bank account:</strong> If amount was deducted, it will be refunded in 3-5 business days
            </p>
            <p style={{ margin: '8px 0' }}>
              • <strong>Contact support:</strong> Call us if you need immediate assistance
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
            onClick={() => navigate('/customer/checkout')}
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
            Try Again
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

          <button
            onClick={() => window.open('tel:+918819859999', '_self')}
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#218838';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#28a745';
            }}
          >
            📞 Call Support
          </button>
        </div>

        {/* Support Information */}
        <div style={{
          background: currentTheme.background,
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '14px',
          color: currentTheme.textSecondary
        }}>
          <p style={{ margin: '0 0 5px 0' }}>
            <strong>Need Help?</strong>
          </p>
          <p style={{ margin: '0' }}>
            Call: +91 88198 59999 | Email: nr8334690@gmail.com
          </p>
        </div>

        {/* Auto-redirect Notice */}
        <div style={{
          color: currentTheme.textSecondary,
          fontSize: '14px',
          fontStyle: 'italic'
        }}>
          You will be automatically redirected to checkout in {countdown} seconds...
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
