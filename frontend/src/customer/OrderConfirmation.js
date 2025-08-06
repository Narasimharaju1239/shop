import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [countdown, setCountdown] = useState(10);

  // Get order data from navigation state
  const orderData = location.state?.orderData;
  const paymentMethod = location.state?.paymentMethod;
  const upiApp = location.state?.upiApp;
  const totalAmount = location.state?.totalAmount;
  const paymentConfirmed = location.state?.paymentStatus;

  // Redirect if no order data
  useEffect(() => {
    if (!orderData) {
      navigate('/customer/orders');
    }
  }, [orderData, navigate]);

  // Countdown timer for auto-redirect - ONLY for confirmed payments
  useEffect(() => {
    // Only start countdown for confirmed payments
    const isPaymentConfirmed = paymentMethod === 'Cash on Delivery' || 
                              (paymentMethod === 'UPI' && paymentConfirmed === 'confirmed');
    
    if (isPaymentConfirmed && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isPaymentConfirmed && countdown <= 0) {
      navigate('/customer/orders');
    }
  }, [countdown, navigate, paymentMethod, paymentConfirmed]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusMessage = () => {
    if (paymentMethod === 'Cash on Delivery') {
      return {
        status: 'Order Confirmed',
        message: 'Your order has been confirmed! Pay cash when the order is delivered.',
        icon: '✅',
        color: '#4caf50'
      };
    } else if (paymentMethod === 'UPI' && paymentConfirmed === 'confirmed') {
      return {
        status: 'Payment Successful',
        message: `Payment completed successfully through ${upiApp}. Your order is confirmed!`,
        icon: '✅',
        color: '#4caf50'
      };
    } else if (paymentMethod === 'UPI') {
      return {
        status: 'Payment Pending',
        message: `Payment request sent to ${upiApp}. Please complete the payment to confirm your order.`,
        icon: '⏳',
        color: '#ff9800'
      };
    }
    return {
      status: 'Order Placed',
      message: 'Your order has been placed successfully!',
      icon: '✅',
      color: '#4caf50'
    };
  };

  const paymentStatus = getPaymentStatusMessage();

  if (!orderData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: currentTheme.background
      }}>
        <div style={{ color: currentTheme.text }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: currentTheme.background,
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: currentTheme.card,
        borderRadius: '12px',
        padding: '40px',
        boxShadow: `0 4px 20px ${currentTheme.shadow}`,
        textAlign: 'center'
      }}>
        {/* Success Icon and Status */}
        <div style={{
          fontSize: '80px',
          marginBottom: '20px'
        }}>
          {paymentStatus.icon}
        </div>

        <h1 style={{
          color: paymentStatus.color,
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '10px'
        }}>
          {paymentStatus.status}
        </h1>

        <p style={{
          color: currentTheme.text,
          fontSize: '18px',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          {paymentStatus.message}
        </p>

        {/* Order Details Card */}
        <div style={{
          background: currentTheme.background,
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '30px',
          textAlign: 'left',
          border: `1px solid ${currentTheme.border}`
        }}>
          <h3 style={{
            color: currentTheme.primary,
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Order Details
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Order ID:</span>
                <div style={{ color: currentTheme.text, fontWeight: '600', fontSize: '16px' }}>
                  #{orderData._id?.slice(-8) || 'N/A'}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Order Date:</span>
                <div style={{ color: currentTheme.text, fontWeight: '600', fontSize: '16px' }}>
                  {formatDate(orderData.createdAt || new Date())}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Payment Method:</span>
                <div style={{ color: currentTheme.text, fontWeight: '600', fontSize: '16px' }}>
                  {paymentMethod === 'UPI' ? `${paymentMethod} (${upiApp})` : paymentMethod}
                </div>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Total Amount:</span>
                <div style={{ color: currentTheme.primary, fontWeight: '700', fontSize: '24px' }}>
                  ₹{totalAmount?.toLocaleString('en-IN') || '0'}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Order Status:</span>
                <div style={{
                  display: 'inline-block',
                  background: '#fff3cd',
                  color: '#856404',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '4px'
                }}>
                  {orderData.status || 'Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UPI Payment Instructions - Only show if payment is not confirmed */}
        {paymentMethod === 'UPI' && paymentConfirmed !== 'confirmed' && (
          <div style={{
            background: `${currentTheme.primary}15`,
            border: `1px solid ${currentTheme.primary}`,
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h4 style={{
              color: currentTheme.primary,
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '15px'
            }}>
              Complete Your Payment
            </h4>
            <div style={{ color: currentTheme.text, fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              <p style={{ margin: '8px 0' }}>
                • Amount: <strong>₹{totalAmount?.toLocaleString('en-IN')}</strong>
              </p>
              <p style={{ margin: '8px 0' }}>
                • UPI ID: <strong>8819859999@ibl</strong>
              </p>
              <p style={{ margin: '8px 0' }}>
                • Reference: <strong>Order #{orderData._id?.slice(-8)}</strong>
              </p>
            </div>
            
            {/* UPI Payment Button */}
            <button
              onClick={() => {
                // Generate UPI URL - Use ONLY standard UPI format
                const generateUpiUrl = (amount, orderId) => {
                  const upiId = '8819859999@ibl';
                  const merchantName = 'Shop Eluru';
                  const transactionNote = `Order #${orderId}`;
                  
                  // ONLY use standard UPI URL format - works with all UPI apps
                  const standardUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
                  
                  return standardUpiUrl;
                };
                
                const upiUrl = generateUpiUrl(totalAmount, orderData._id?.slice(-8));
                
                // IMMEDIATE UPI app opening (user gesture required)
                try {
                  // Method 1: Direct navigation (most reliable)
                  window.open(upiUrl, '_self');
                  
                } catch (error) {
                  console.log('Primary UPI opening failed, trying fallback:', error);
                  try {
                    // Method 2: Location href
                    window.location.href = upiUrl;
                  } catch (fallbackError) {
                    console.log('All UPI opening methods failed:', fallbackError);
                    // Final fallback - show manual payment instructions
                    alert(`Unable to open UPI app automatically. Please copy these details and pay manually:\n\nUPI ID: 8819859999@ibl\nAmount: ₹${totalAmount?.toLocaleString('en-IN')}\nNote: Order #${orderData._id?.slice(-8)}`);
                  }
                }
                
                // Store order data for payment pending page (immediate, no timeout)
                const pendingOrderData = {
                  items: [], // Empty for now since order is already created
                  shipping: orderData.shipping || {},
                  totalAmount: totalAmount,
                  tempOrderId: orderData._id?.slice(-8)
                };
                sessionStorage.setItem('pendingOrder', JSON.stringify(pendingOrderData));
                
                // Navigate immediately (no timeout) to payment pending
                navigate('/customer/payment-pending', {
                  state: {
                    upiApp: upiApp,
                    totalAmount: totalAmount,
                    tempOrderId: orderData._id?.slice(-8),
                    upiUrl: upiUrl
                  }
                });
              }}
              style={{
                width: '100%',
                padding: '15px 30px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '15px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#0056b3';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#007bff';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>📱</span> Pay with {upiApp}
            </button>
            
            {/* Manual UPI Instructions */}
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '15px'
            }}>
              <p style={{ 
                margin: '0 0 8px 0', 
                fontSize: '13px', 
                fontWeight: '600',
                color: currentTheme.text
              }}>
                If app doesn't open, copy these details:
              </p>
              <div style={{ 
                background: '#fff',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #e9ecef',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#495057'
              }}>
                UPI ID: <strong>8819859999@ibl</strong><br/>
                Amount: <strong>₹{totalAmount?.toLocaleString('en-IN')}</strong><br/>
                Note: <strong>Order #{orderData._id?.slice(-8)}</strong>
              </div>
            </div>
            
            <p style={{ 
              margin: '0', 
              fontSize: '12px', 
              color: currentTheme.textSecondary,
              textAlign: 'center'
            }}>
              Click "Pay with {upiApp}" to open any UPI app or copy details above for manual payment
            </p>
          </div>
        )}

        {/* Payment Success Message for confirmed UPI payments */}
        {paymentMethod === 'UPI' && paymentConfirmed === 'confirmed' && (
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
              🎉 Payment Successful!
            </h4>
            <div style={{ color: currentTheme.text, fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '8px 0' }}>
                • Your payment of <strong>₹{totalAmount?.toLocaleString('en-IN')}</strong> has been received
              </p>
              <p style={{ margin: '8px 0' }}>
                • Payment method: <strong>{upiApp}</strong>
              </p>
              <p style={{ margin: '8px 0' }}>
                • Your order is now confirmed and will be processed shortly
              </p>
              <p style={{ margin: '8px 0' }}>
                • You will receive updates on order status
              </p>
            </div>
          </div>
        )}

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
            View All Orders
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

        {/* Auto-redirect Notice - Only show for confirmed payments */}
        {(paymentMethod === 'Cash on Delivery' || 
          (paymentMethod === 'UPI' && paymentConfirmed === 'confirmed')) && (
          <div style={{
            color: currentTheme.textSecondary,
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            You will be automatically redirected to your orders in {countdown} seconds...
          </div>
        )}

        {/* For pending UPI payments - show different message */}
        {paymentMethod === 'UPI' && paymentConfirmed !== 'confirmed' && (
          <div style={{
            color: '#ff9800',
            fontSize: '14px',
            fontStyle: 'italic',
            background: '#fff3cd',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ffeaa7'
          }}>
            ⚠️ Payment required to confirm order. Click "Pay with {upiApp}" above to complete payment.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
