import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import API from '../utils/api';

const PaymentPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { clearCart } = useContext(CartContext);
  
  const { upiApp, totalAmount, tempOrderId, upiUrl } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentAttempted, setPaymentAttempted] = useState(false);

  // Auto-open UPI app when component loads - but only with user interaction
  useEffect(() => {
    if (upiUrl && !paymentAttempted) {
      setPaymentAttempted(true);
      
      // Show instruction immediately instead of auto-opening
      // (auto-opening without user gesture will fail)
      setTimeout(() => {
        toast.info(`Click "Open UPI App" button below to pay with ${upiApp}`, {
          autoClose: 5000
        });
      }, 1000);
    }
  }, [upiUrl, paymentAttempted, upiApp]);

  // Redirect if no payment data
  useEffect(() => {
    if (!upiApp || !totalAmount || !tempOrderId) {
      toast.error('Invalid payment session');
      navigate('/customer/checkout');
    }
  }, [upiApp, totalAmount, tempOrderId, navigate]);

  // Check if order data exists in session storage
  const pendingOrderData = JSON.parse(sessionStorage.getItem('pendingOrder') || '{}');

  // Generate UPI URL function
  const generateUpiUrl = (upiApp, amount, orderId) => {
    const upiId = '8819859999@ibl'; // Your UPI ID
    const merchantName = 'Shop Eluru';
    const transactionNote = `Order #${orderId}`;
    
    // Use standard UPI URL format for better compatibility
    const standardUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
    
    return standardUpiUrl;
  };

  const handlePaymentCompleted = async () => {
    if (!pendingOrderData.items || !pendingOrderData.shipping) {
      toast.error('Order data not found. Please try again.');
      navigate('/customer/checkout');
      return;
    }

    setLoading(true);
    try {
      // Place the actual order now that payment is completed
      const response = await API.post('/orders', { 
        items: pendingOrderData.items, 
        shipping: pendingOrderData.shipping 
      });
      const orderData = response.data;
      
      // Clear the pending order from session storage
      sessionStorage.removeItem('pendingOrder');
      
      // Clear the cart
      clearCart();
      
      toast.success('Payment confirmed! Order placed successfully!');
      
      // Navigate to order confirmation
      navigate('/customer/order-confirmation', { 
        state: { 
          orderData, 
          paymentMethod: 'UPI',
          upiApp: upiApp,
          totalAmount: totalAmount,
          paymentStatus: 'confirmed'
        } 
      });
      
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailed = () => {
    toast.error('Payment cancelled or failed');
    navigate('/customer/checkout');
  };

  const openUpiApp = () => {
    const finalUpiUrl = upiUrl || generateUpiUrl(upiApp, totalAmount, tempOrderId);
    
    // IMMEDIATE opening (within user gesture) - no timeouts
    try {
      // Method 1: Direct navigation
      window.location.href = finalUpiUrl;
      
      // Method 2: Create and click link immediately (backup)
      const link = document.createElement('a');
      link.href = finalUpiUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.log('UPI app opening failed:', error);
      // Show manual payment alert immediately
      alert(`Please open your UPI app manually and pay:\n\nUPI ID: 8819859999@ibl\nAmount: ₹${totalAmount?.toLocaleString('en-IN')}\nNote: Order #${tempOrderId}`);
    }
    
    toast.success(`Opening UPI app for payment...`);
  };

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
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'pulse 2s infinite'
          }}>
            ⏳
          </div>
          <h2 style={{ 
            color: currentTheme.primary, 
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Payment Pending
          </h2>
          <p style={{ 
            color: currentTheme.text, 
            fontSize: '16px',
            margin: 0
          }}>
            Complete your payment in {upiApp} app
          </p>
        </div>

        {/* Payment Details */}
        <div style={{
          background: currentTheme.background,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          border: `1px solid ${currentTheme.primary}20`
        }}>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: currentTheme.text, fontSize: '16px' }}>
              Amount to Pay:
            </span>
            <div style={{ 
              color: currentTheme.primary, 
              fontSize: '24px',
              fontWeight: '700',
              marginTop: '5px'
            }}>
              ₹{totalAmount?.toLocaleString('en-IN')}
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <span style={{ color: currentTheme.text, fontSize: '16px' }}>
              Payment App:
            </span>
            <div style={{ 
              color: currentTheme.primary, 
              fontSize: '18px',
              fontWeight: '600',
              marginTop: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span>
                {upiApp === 'PhonePe' && '💜'}
                {upiApp === 'Google Pay' && '🔵'}
                {upiApp === 'Paytm' && '💙'}
                {upiApp === 'Amazon Pay' && '🟠'}
                {upiApp === 'BHIM' && '🇮🇳'}
                {upiApp === 'WhatsApp Pay' && '💚'}
              </span>
              {upiApp}
            </div>
          </div>

          <div style={{ 
            background: `${currentTheme.primary}15`,
            borderRadius: '6px',
            padding: '10px',
            fontSize: '14px',
            color: currentTheme.text
          }}>
            Order ID: #{tempOrderId}
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: `${currentTheme.primary}10`,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h4 style={{ 
            color: currentTheme.primary, 
            margin: '0 0 15px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            How to Complete Payment:
          </h4>
          <ol style={{ 
            color: currentTheme.text, 
            fontSize: '14px',
            margin: 0,
            paddingLeft: '20px'
          }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Click "Open {upiApp} App"</strong> button above
            </li>
            <li style={{ marginBottom: '8px' }}>
              If app doesn't open, <strong>copy UPI ID</strong> from yellow box and pay manually
            </li>
            <li style={{ marginBottom: '8px' }}>
              After successful payment, <strong>return to this page</strong>
            </li>
            <li>
              Click <strong>"Payment Completed"</strong> to confirm your order
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexDirection: 'column'
        }}>
          {/* Large Open UPI App Button */}
          <button
            onClick={openUpiApp}
            style={{
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
              gap: '8px'
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
            <span>📱</span> Open {upiApp} App
          </button>

          {/* Manual Payment Details */}
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '15px',
            fontSize: '14px',
            color: '#856404'
          }}>
            <strong>💡 Manual Payment:</strong>
            <br />
            UPI ID: <strong>8819859999@ibl</strong>
            <br />
            Amount: <strong>₹{totalAmount?.toLocaleString('en-IN')}</strong>
            <br />
            Note: <strong>Order #{tempOrderId}</strong>
          </div>

          <button
            onClick={handlePaymentCompleted}
            disabled={loading}
            style={{
              padding: '15px 30px',
              background: loading ? '#ccc' : '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = '#218838';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = loading ? '#ccc' : '#28a745';
              e.currentTarget.style.transform = 'none';
            }}
          >
            {loading ? (
              <>
                <span>⏳</span> Processing Order...
              </>
            ) : (
              <>
                <span>✅</span> Payment Completed
              </>
            )}
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePaymentFailed}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#c82333';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#dc3545';
                e.currentTarget.style.transform = 'none';
              }}
            >
              ❌ Cancel Order
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: currentTheme.background,
          borderRadius: '8px',
          fontSize: '12px',
          color: currentTheme.textSecondary
        }}>
          <p style={{ margin: 0 }}>
            💡 <strong>Need Help?</strong> If you're facing issues with payment, 
            please contact our support team with Order ID: #{tempOrderId}
          </p>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PaymentPending;
