import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GuestCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // If user is logged in, redirect to home or customer cart
    if (user) {
      navigate('/customer/cart');
      return;
    }
    const saved = localStorage.getItem('cartItems');
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [user, navigate]);

  const handleAdd = (item) => {
    const updated = cartItems.map((cartItem) => {
      if ((cartItem.product?._id || cartItem._id) === (item.product?._id || item._id)) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const handleRemove = (item) => {
    if (item.quantity > 1) {
      const updated = cartItems.map((cartItem) => {
        if ((cartItem.product?._id || cartItem._id) === (item.product?._id || item._id)) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
    } else {
      const updated = cartItems.filter(cartItem => (cartItem.product?._id || cartItem._id) !== (item.product?._id || item._id));
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
    }
  };

  const handleRemoveAll = () => {
    const confirmed = window.confirm('Do you want to remove all products from cart?');
    if (confirmed) {
      setCartItems([]);
      localStorage.setItem('cartItems', JSON.stringify([]));
    }
  };

  // If user is logged in, don't render anything (redirect happens in useEffect)
  if (user) return null;

  return (
    <div style={{
      padding: '32px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '32px',
      background: '#f7f9fc',
      minHeight: '100vh',
      justifyContent: 'center',
    }}>
      <div style={{
        flex: '2',
        minWidth: '340px',
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '32px',
        marginBottom: '24px',
        maxWidth: '540px',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 18, color: '#222' }}>Guest Cart</h2>
        {cartItems.length === 0 ? (
          <p style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 32 }}>Your cart is empty</p>
        ) : (
          <div>
            <button onClick={handleRemoveAll} style={{ padding: '10px 22px', background: '#e53935', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '18px', borderRadius: '8px', fontWeight: 600, fontSize: 16 }}>Remove All</button>
            {cartItems.map((item) => (
              <div key={`${item.product?._id || item._id}-${item.quantity}`} style={{
                borderBottom: '1px solid #eee',
                padding: '18px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 17,
                background: '#fafbfc',
                borderRadius: '10px',
                marginBottom: '10px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, color: '#222' }}>
                    {item.product?.name || item.name || '-'} <span style={{ color: '#888', fontSize: 15 }}>x {item.quantity}</span>
                  </div>
                  <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
                    GST: <b>{item.product?.gst !== undefined && item.product?.gst !== null ? `${item.product.gst}%` : (item.gst ? `${item.gst}%` : '-')}</b> &nbsp;|&nbsp; HSN Code: <b>{item.product?.hsnCode ?? item.hsnCode ?? '-'}</b>
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#00796b' }}>
                  ₹{item.product?.price ? Math.round(item.product.price * (1 - (item.product.offer || 0) / 100) * item.quantity).toLocaleString('en-IN') : (item.price ? Math.round(item.price * (1 - (item.offer || 0) / 100) * item.quantity).toLocaleString('en-IN') : '-')}
                  {item.product?.offer ? (
                    <span style={{ color: '#888', fontSize: 15, marginLeft: 8, textDecoration: 'line-through' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  ) : null}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => handleRemove(item)} style={{ padding: '6px 12px', background: '#eee', border: 'none', cursor: 'pointer', borderRadius: '6px', fontWeight: 600, fontSize: 16 }}>-</button>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{item.quantity}</span>
                  <button onClick={() => handleAdd(item)} style={{ padding: '6px 12px', background: '#eee', border: 'none', cursor: 'pointer', borderRadius: '6px', fontWeight: 600, fontSize: 16 }}>+</button>
                  <button onClick={() => handleRemove(item)} style={{ padding: '6px 12px', background: '#e53935', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px', borderRadius: '6px', fontWeight: 600, fontSize: 16 }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Price Details Section */}
      {cartItems.length > 0 && (
        <div style={{
          flex: '1',
          minWidth: '300px',
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '32px',
          fontSize: 17,
          height: 'fit-content',
          maxWidth: '340px',
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 10, color: '#222' }}>PRICE DETAILS</h3>
          {/* Calculate price details */}
          {(() => {
            const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const totalMRP = cartItems.reduce((sum, item) => sum + ((item.product?.price || item.price || 0) * (item.quantity || 1)), 0);
            const totalDiscount = cartItems.reduce((sum, item) => {
              const offer = item.product?.offer || item.offer || 0;
              return sum + (((item.product?.price || item.price || 0) * (offer / 100)) * (item.quantity || 1));
            }, 0);
            const totalAmount = totalMRP - totalDiscount;
            const totalSavings = totalDiscount;
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span>Price ({itemCount} items)</span>
                  <span style={{ fontWeight: 700 }}>₹{totalMRP.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span>Discount</span>
                  <span style={{ color: '#388e3c', fontWeight: 700 }}>- ₹{Math.round(totalDiscount).toLocaleString('en-IN')}</span>
                </div>
                {/* No Promise Fee, No Coupon */}
                <div style={{ borderTop: '1px solid #eee', margin: '18px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>
                  <span>Total Amount</span>
                  <span>₹{Math.round(totalAmount).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ color: '#388e3c', fontWeight: 700, fontSize: 17, marginTop: 10 }}>
                  You will save ₹{Math.round(totalSavings).toLocaleString('en-IN')} on this order
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default GuestCart;
