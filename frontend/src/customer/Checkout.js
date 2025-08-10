import React, { useState, useContext, useEffect, useCallback } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [details, setDetails] = useState({ 
    address: '', 
    paymentMethod: 'Cash on Delivery',
    phone: '',
    alternativePhone: '',
    name: '',
    email: '',
    pincode: '',
    city: '',
    state: '',
    landmark: '',
    upiApp: 'PhonePe' // Default UPI app
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { cartItems, clearCart } = useContext(CartContext);
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  // Calculate total function
  const calculateTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const offer = item.product?.offer || 0;
      const finalPrice = price * (1 - offer / 100);
      return sum + (finalPrice * item.quantity);
    }, 0);
  }, [cartItems]);

  // Check if we're on production website (not localhost)
  const isProduction = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

  // Handle navigation confirmation for checkout
  const handleNavigation = (path) => {
    if (isProduction && cartItems.length > 0) {
      const userChoice = window.confirm(
        "Do you want to cancel your order?\n\n" +
        "• Click 'OK' to cancel order and continue shopping\n" +
        "• Click 'Cancel' to stay on checkout page"
      );
      
      if (userChoice) {
        // User wants to cancel order and continue shopping
        navigate(path);
      }
      // If user clicks 'Cancel', they stay on checkout page
    } else {
      // On localhost or empty cart, navigate normally
      navigate(path);
    }
  };

  // Update payment method when cart total changes
  useEffect(() => {
    const total = calculateTotal();
    if (total >= 10000 && details.paymentMethod === 'Cash on Delivery') {
      setDetails(prev => ({ ...prev, paymentMethod: 'UPI' }));
    }
  }, [cartItems, details.paymentMethod, calculateTotal]);

  // Handle browser back button for checkout page
  useEffect(() => {
    if (isProduction && cartItems.length > 0) {
      const handlePopState = (e) => {
        const userChoice = window.confirm(
          "Do you want to cancel your order and go back?\n\n" +
          "• Click 'OK' to cancel order and go back\n" +
          "• Click 'Cancel' to stay on checkout page"
        );
        
        if (!userChoice) {
          // User wants to stay, push the current state back
          window.history.pushState(null, null, window.location.pathname);
        }
      };

      // Add event listeners
      window.addEventListener('popstate', handlePopState);
      
      // Push initial state to handle back button
      window.history.pushState(null, null, window.location.pathname);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isProduction, cartItems.length]);

  // Function to fetch location details from pincode
  const fetchLocationFromPincode = async (pincode) => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) return;
    
    setPincodeLoading(true);
    try {
      // Using India Post Pincode API
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setDetails(prev => ({
          ...prev,
          city: postOffice.District || '',
          state: postOffice.State || ''
        }));
        toast.success('Location details filled automatically!');
      } else {
        toast.warning('Location not found for this pincode');
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      toast.error('Unable to fetch location details');
    } finally {
      setPincodeLoading(false);
    }
  };

  // Handle pincode change with auto-fill
  const handlePincodeChange = (e) => {
    const pincode = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setDetails({ ...details, pincode });
    
    if (pincode.length === 6) {
      fetchLocationFromPincode(pincode);
    }
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using Google Geocoding API (you might need to replace with your preferred service)
          // For demo, using a public service (in production, you'd want to use your own API key)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          if (data) {
            setDetails(prev => ({
              ...prev,
              address: `${data.locality || ''} ${data.city || ''} ${data.principalSubdivision || ''}`.trim()
            }));
            toast.success('Address filled from current location!');
          } else {
            toast.warning('Unable to get address details from location');
          }
        } catch (error) {
          console.error('Error getting address from coordinates:', error);
          toast.error('Failed to get address from location');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please allow location permission.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!details.name.trim()) newErrors.name = 'Name is required';
    if (!details.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!details.alternativePhone.trim()) newErrors.alternativePhone = 'Alternative phone number is required';
    if (!details.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(details.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!details.address.trim()) newErrors.address = 'Address is required';
    if (!details.city.trim()) newErrors.city = 'City is required';
    if (!details.state.trim()) newErrors.state = 'State is required';
    if (!details.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!details.landmark.trim()) newErrors.landmark = 'Landmark is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to generate UPI payment URL
  const generateUpiUrl = (upiApp, amount, orderId) => {
    const upiId = '8819859999@ibl'; // Your UPI ID
    const merchantName = 'Shop Eluru';
    const transactionNote = `Order #${orderId}`;
    
    // Use standard UPI URL format for better compatibility
    const standardUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
    
    return standardUpiUrl;
  };

  const handleOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Calculate amount before clearing cart
      const totalAmount = Math.round(calculateTotal());
      
      // For Cash on Delivery - place order immediately
      if (details.paymentMethod === 'Cash on Delivery') {
        const response = await API.post('/orders', { items: cartItems, shipping: details });
        const orderData = response.data;
        
        toast.success('Order placed successfully!');
        
        // Clear cart and navigate to order confirmation
        clearCart();
        navigate('/customer/order-confirmation', { 
          state: { 
            orderData, 
            paymentMethod: details.paymentMethod,
            totalAmount: totalAmount,
            paymentStatus: 'confirmed'
          } 
        });
      }
      
      // For UPI payment - redirect to payment app first, don't place order yet
      else if (details.paymentMethod === 'UPI') {
        const tempOrderId = Date.now().toString();
        const upiUrl = generateUpiUrl(details.upiApp, totalAmount, tempOrderId);
        
        // Show confirmation before redirecting
        const confirmRedirect = window.confirm(
          `You will be redirected to ${details.upiApp} to pay ₹${totalAmount.toLocaleString('en-IN')}.\n\nAfter completing payment, return to confirm your order.\n\nClick OK to open ${details.upiApp} app.`
        );
        
        if (confirmRedirect) {
          // Store order details temporarily for after payment
          const tempOrderData = {
            items: cartItems,
            shipping: details,
            totalAmount: totalAmount,
            tempOrderId: tempOrderId
          };
          
          // Store in sessionStorage to retrieve after payment
          sessionStorage.setItem('pendingOrder', JSON.stringify(tempOrderData));
          
          // Navigate to payment pending page first
          navigate('/customer/payment-pending', { 
            state: { 
              upiApp: details.upiApp,
              totalAmount: totalAmount,
              tempOrderId: tempOrderId,
              upiUrl: upiUrl // Pass the UPI URL to the payment page
            } 
          });
        }
      }
      
      // For PayU payment - initiate PayU payment gateway
      else if (details.paymentMethod === 'PayU') {
        // Show confirmation before proceeding
        const confirmPayment = window.confirm(
          `You will be redirected to PayU secure payment gateway to pay ₹${totalAmount.toLocaleString('en-IN')}.\n\nYou can pay using Card, UPI, Net Banking, or Wallet.\n\nClick OK to proceed to payment.`
        );
        
        if (confirmPayment) {
          try {
            // Generate order ID
            const orderId = Date.now().toString();
            
            // Call PayU initiate API with correct format
            const payuResponse = await API.post('/payu/initiate', {
              orderId: orderId,
              amount: totalAmount,
              customerData: {
                name: details.name,
                email: details.email || 'customer@shopeluru.com',
                phone: details.phone
              },
              orderDescription: `Order from Shop Eluru - ${cartItems.length} items`
            });
            
            if (payuResponse.data.success) {
              const { paymentData } = payuResponse.data;

              // Create a form and submit to PayU
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = paymentData.action || paymentData.paymentUrl;

              // Add all PayU parameters as hidden inputs
              Object.keys(paymentData).forEach(key => {
                if (key !== 'action' && key !== 'success' && key !== 'paymentUrl') {
                  const input = document.createElement('input');
                  input.type = 'hidden';
                  input.name = key;
                  input.value = paymentData[key];
                  form.appendChild(input);
                }
              });

              document.body.appendChild(form);
              form.submit();
              document.body.removeChild(form);
            } else {
              throw new Error(payuResponse.data.message || 'PayU initialization failed');
            }
          } catch (payuError) {
            console.error('PayU payment error:', payuError);
            toast.error('Payment gateway initialization failed. Please try again.');
          }
        }
      }
      
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: currentTheme.background, 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        {/* Left Side - Checkout Form */}
        <div style={{ 
          flex: '2', 
          minWidth: '400px',
          background: currentTheme.card,
          borderRadius: '12px',
          padding: '30px',
          boxShadow: `0 4px 20px ${currentTheme.shadow}`,
          height: 'fit-content'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '30px'
          }}>
            <h2 style={{ 
              color: currentTheme.primary, 
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              borderBottom: `2px solid ${currentTheme.primary}`,
              paddingBottom: '10px',
              flex: 1
            }}>
              Checkout
            </h2>
            <button
              onClick={() => handleNavigation('/customer/products')}
              style={{
                background: 'transparent',
                border: `2px solid ${currentTheme.primary}`,
                color: currentTheme.primary,
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginLeft: '20px'
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
              ← Continue Shopping
            </button>
          </div>

          {/* Personal Information */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Personal Information
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: currentTheme.text,
                fontWeight: '500'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.name ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: currentTheme.background,
                  color: currentTheme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
              />
              {errors.name && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.name}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: currentTheme.text,
                fontWeight: '500'
              }}>
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.phone ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: currentTheme.background,
                  color: currentTheme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
              />
              {errors.phone && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.phone}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: currentTheme.text,
                fontWeight: '500'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={details.email}
                onChange={(e) => setDetails({ ...details, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.email ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: currentTheme.background,
                  color: currentTheme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
              />
              {errors.email && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.email}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: currentTheme.text,
                fontWeight: '500'
              }}>
                Alternative Phone Number *
              </label>
              <input
                type="tel"
                placeholder="Alternative contact number"
                value={details.alternativePhone}
                onChange={(e) => setDetails({ ...details, alternativePhone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.alternativePhone ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: currentTheme.background,
                  color: currentTheme.text,
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
              />
              {errors.alternativePhone && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.alternativePhone}</span>}
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Shipping Address
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: currentTheme.text,
                fontWeight: '500'
              }}>
                Complete Address *
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  placeholder="House/Flat No, Building, Street, Area"
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingBottom: '50px', // Make room for button
                    border: errors.address ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: currentTheme.background,
                    color: currentTheme.text,
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, sans-serif'
                  }}
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    padding: '6px 12px',
                    background: locationLoading ? '#ccc' : currentTheme.primary,
                    color: currentTheme.buttonText,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: locationLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    if (!locationLoading) {
                      e.currentTarget.style.background = currentTheme.primaryHover || currentTheme.primary;
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = locationLoading ? '#ccc' : currentTheme.primary;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {locationLoading ? '⏳' : '📍'} {locationLoading ? 'Getting...' : 'Use Current Location'}
                </button>
              </div>
              {errors.address && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.address}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: currentTheme.text,
                fontWeight: '500'
              }}>
                Nearby Landmark *
              </label>
              <input
                type="text"
                placeholder="e.g., Near City Mall, Opposite Bank, etc."
                value={details.landmark}
                onChange={(e) => setDetails({ ...details, landmark: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.landmark ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: details.landmark && !errors.landmark ? currentTheme.success || '#e8f5e8' : currentTheme.background,
                  color: currentTheme.text,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
              />
              {errors.landmark && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.landmark}</span>}
              <small style={{ 
                color: currentTheme.textSecondary, 
                fontSize: '12px',
                display: 'block',
                marginTop: '4px'
              }}>
                Helps delivery partner locate your address easily
              </small>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  color: currentTheme.text,
                  fontWeight: '500'
                }}>
                  City *
                </label>
                <input
                  type="text"
                  placeholder="City (auto-filled from pincode)"
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.city ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: details.city && !errors.city ? currentTheme.success || '#e8f5e8' : currentTheme.background,
                    color: currentTheme.text,
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.city && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.city}</span>}
              </div>

              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  color: currentTheme.text,
                  fontWeight: '500'
                }}>
                  State *
                </label>
                <input
                  type="text"
                  placeholder="State (auto-filled from pincode)"
                  value={details.state}
                  onChange={(e) => setDetails({ ...details, state: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: errors.state ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: details.state && !errors.state ? currentTheme.success || '#e8f5e8' : currentTheme.background,
                    color: currentTheme.text,
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.state && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.state}</span>}
              </div>

              <div style={{ flex: '1', minWidth: '120px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  color: currentTheme.text,
                  fontWeight: '500'
                }}>
                  Pincode *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={details.pincode}
                    onChange={handlePincodeChange}
                    maxLength="6"
                    style={{
                      width: '100%',
                      padding: '12px',
                      paddingRight: pincodeLoading ? '40px' : '12px',
                      border: errors.pincode ? '2px solid #e53935' : `1px solid ${currentTheme.primary}`,
                      borderRadius: '8px',
                      fontSize: '16px',
                      background: currentTheme.background,
                      color: currentTheme.text,
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                  />
                  {pincodeLoading && (
                    <div style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '16px'
                    }}>
                      ⏳
                    </div>
                  )}
                </div>
                {errors.pincode && <span style={{ color: '#e53935', fontSize: '14px' }}>{errors.pincode}</span>}
                <small style={{ 
                  color: currentTheme.textSecondary, 
                  fontSize: '12px',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  City & State will auto-fill
                </small>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Payment Method
            </h3>
            <select
              value={details.paymentMethod}
              onChange={(e) => setDetails({ ...details, paymentMethod: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '8px',
                fontSize: '16px',
                background: currentTheme.background,
                color: currentTheme.text,
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
                marginBottom: '15px'
              }}
            >
              {calculateTotal() < 10000 && (
                <option value="Cash on Delivery">💵 Cash on Delivery</option>
              )}
              <option value="UPI">📱 UPI Payment</option>
              <option value="PayU">💳 PayU Gateway (Card/UPI/Wallet)</option>
            </select>
            {details.paymentMethod === 'PayU' && (
              <div style={{ marginTop: '10px', color: currentTheme.primary, fontWeight: '500', fontSize: '15px' }}>
                You will be redirected to PayU secure payment gateway. Supports Card, UPI, Net Banking, Wallet.
              </div>
            )}

            {/* UPI App Selection - Show only when UPI is selected */}
            {details.paymentMethod === 'UPI' && (
              <div style={{ marginTop: '15px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  color: currentTheme.text,
                  fontWeight: '500'
                }}>
                  Choose UPI App
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '12px',
                  marginBottom: '15px'
                }}>
                  {[
                    { name: 'PhonePe', icon: '💜', color: '#5f259f' },
                    { name: 'Google Pay', icon: '🔵', color: '#4285f4' },
                    { name: 'Paytm', icon: '💙', color: '#002970' },
                    { name: 'Amazon Pay', icon: '🟠', color: '#ff9900' },
                    { name: 'BHIM', icon: '🇮🇳', color: '#ff6600' },
                    { name: 'WhatsApp Pay', icon: '💚', color: '#25d366' }
                  ].map((app) => (
                    <div
                      key={app.name}
                      onClick={() => setDetails({ ...details, upiApp: app.name })}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '12px 8px',
                        border: details.upiApp === app.name 
                          ? `2px solid ${app.color}` 
                          : `1px solid ${currentTheme.border}`,
                        borderRadius: '8px',
                        background: details.upiApp === app.name 
                          ? `${app.color}15` 
                          : currentTheme.background,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center'
                      }}
                      onMouseEnter={e => {
                        if (details.upiApp !== app.name) {
                          e.currentTarget.style.background = currentTheme.hover;
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (details.upiApp !== app.name) {
                          e.currentTarget.style.background = currentTheme.background;
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                        {app.icon}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: details.upiApp === app.name ? '600' : '500',
                        color: details.upiApp === app.name ? app.color : currentTheme.text
                      }}>
                        {app.name}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Selected UPI App Display */}
                <div style={{
                  padding: '12px',
                  background: `${currentTheme.primary}15`,
                  border: `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ color: currentTheme.primary, fontWeight: '600' }}>
                    Selected: {details.upiApp}
                  </span>
                  <span style={{ fontSize: '16px' }}>
                    {details.upiApp === 'PhonePe' && '💜'}
                    {details.upiApp === 'Google Pay' && '🔵'}
                    {details.upiApp === 'Paytm' && '💙'}
                    {details.upiApp === 'Amazon Pay' && '🟠'}
                    {details.upiApp === 'BHIM' && '🇮🇳'}
                    {details.upiApp === 'WhatsApp Pay' && '💚'}
                  </span>
                </div>
              </div>
            )}

            {calculateTotal() >= 10000 && (
              <small style={{ 
                color: currentTheme.textSecondary, 
                fontSize: '12px',
                display: 'block',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                💡 Cash on Delivery is available for orders below ₹10,000. Current total: ₹{Math.round(calculateTotal()).toLocaleString('en-IN')}
              </small>
            )}
          </div>

          {/* Place Order Button */}
          <button 
            onClick={handleOrder}
            disabled={loading || cartItems.length === 0}
            style={{
              width: '100%',
              padding: '15px',
              background: loading || cartItems.length === 0 ? '#ccc' : currentTheme.button,
              color: currentTheme.buttonText,
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={e => {
              if (!loading && cartItems.length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${currentTheme.shadow}`;
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.shadow}`;
            }}
          >
            {loading ? (
              '⏳ Processing...'
            ) : details.paymentMethod === 'UPI' ? (
              `🛒 Pay with ${details.upiApp} - ₹${Math.round(calculateTotal()).toLocaleString('en-IN')}`
            ) : details.paymentMethod === 'PayU' ? (
              `💳 Pay with PayU - ₹${Math.round(calculateTotal()).toLocaleString('en-IN')}`
            ) : (
              `🛒 Place Order - ₹${Math.round(calculateTotal()).toLocaleString('en-IN')}`
            )}
          </button>
        </div>

        {/* Right Side - Order Summary */}
        <div style={{ 
          flex: '1', 
          minWidth: '300px',
          background: currentTheme.card,
          borderRadius: '12px',
          padding: '30px',
          boxShadow: `0 4px 20px ${currentTheme.shadow}`,
          height: 'fit-content'
        }}>
          <h3 style={{ 
            color: currentTheme.primary, 
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: '600',
            borderBottom: `1px solid ${currentTheme.primary}`,
            paddingBottom: '10px'
          }}>
            Order Summary
          </h3>

          {cartItems.length === 0 ? (
            <p style={{ color: currentTheme.text, textAlign: 'center', padding: '20px' }}>
              Your cart is empty
            </p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} style={{
                  borderBottom: `1px solid ${currentTheme.textSecondary}20`,
                  paddingBottom: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        color: currentTheme.text, 
                        margin: '0 0 5px 0',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}>
                        {item.product?.name || 'Product'}
                      </h4>
                      <p style={{ 
                        color: currentTheme.textSecondary, 
                        margin: 0,
                        fontSize: '14px'
                      }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {item.product?.offer > 0 ? (
                        <>
                          <div style={{ 
                            color: currentTheme.primary, 
                            fontWeight: '600',
                            fontSize: '16px'
                          }}>
                            ₹{Math.round((item.product.price * (1 - item.product.offer / 100)) * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div style={{ 
                            color: currentTheme.textSecondary, 
                            textDecoration: 'line-through',
                            fontSize: '14px'
                          }}>
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </>
                      ) : (
                        <div style={{ 
                          color: currentTheme.primary, 
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ 
                borderTop: `2px solid ${currentTheme.primary}`,
                paddingTop: '15px',
                marginTop: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: currentTheme.text, 
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    Total Amount:
                  </span>
                  <span style={{ 
                    color: currentTheme.primary, 
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>
                    ₹{Math.round(calculateTotal()).toLocaleString('en-IN')}
                  </span>
                </div>
                <p style={{ 
                  color: currentTheme.textSecondary, 
                  fontSize: '14px',
                  margin: '10px 0 0 0',
                  textAlign: 'center'
                }}>
                  Inclusive of all taxes
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
