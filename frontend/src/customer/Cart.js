import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, setCartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();


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
      removeFromCart(item.product?._id || item._id);
    }
  };

  const handleRemoveAll = () => {
    const confirmed = window.confirm('Do you want to remove all products from cart?');
    if (confirmed) {
      // Clear cart from backend as well as local state
      clearCart();
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
      <div style={{ flex: '2', minWidth: '320px' }}>
        <h2>Cart</h2>
        {cartItems.length === 0 ? <p>Your cart is empty</p> : (
          <div>
            <button onClick={handleRemoveAll} style={{ padding: '8px 16px', background: '#e53935', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '10px' }}>Remove All</button>
            {cartItems.map((item) => (
              <div key={`${item.product?._id || item._id}-${item.quantity}`} style={{
                borderBottom: '1px solid #eee', padding: '10px 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16
              }}>
                <span>
                  {item.product?.name || '-'} <span style={{ color: '#888', fontSize: 14 }}>x {item.quantity}</span>
                </span>
                <span style={{ fontWeight: 600 }}>
                  ₹{item.product?.price ? Math.round(item.product.price * (1 - (item.product.offer || 0) / 100) * item.quantity).toLocaleString('en-IN') : '-'}
                  {item.product?.offer ? (
                    <span style={{ color: '#888', fontSize: 14, marginLeft: 6, textDecoration: 'line-through' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  ) : null}
                </span>
                <div>
                  <button onClick={() => handleRemove(item)} style={{ padding: '5px 10px', marginRight: '5px', background: '#eee', border: 'none', cursor: 'pointer' }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleAdd(item)} style={{ padding: '5px 10px', marginLeft: '5px', background: '#eee', border: 'none', cursor: 'pointer' }}>+</button>
                  <button onClick={() => removeFromCart(item.product?._id || item._id)} style={{ padding: '5px 10px', background: '#e53935', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/customer/checkout')} style={{
              padding: '10px 20px', background: '#00796b', color: '#fff',
              border: 'none', marginTop: '10px', fontWeight: 600, fontSize: 16
            }}>Proceed to Checkout</button>
          </div>
        )}
      </div>
      {/* Price Details Section */}
      {cartItems.length > 0 && (
        <div style={{ flex: '1', minWidth: '280px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px #eee', padding: '24px', fontSize: 16, height: 'fit-content' }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>PRICE DETAILS</h3>
          {/* Calculate price details */}
          {(() => {
            const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const totalMRP = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
            const totalDiscount = cartItems.reduce((sum, item) => {
              const offer = item.product?.offer || 0;
              return sum + ((item.product?.price || 0) * (offer / 100)) * (item.quantity || 1);
            }, 0);
            const totalAmount = totalMRP - totalDiscount;
            const totalSavings = totalDiscount;
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Price ({itemCount} items)</span>
                  <span style={{ fontWeight: 600 }}>₹{totalMRP.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>Discount</span>
                  <span style={{ color: '#388e3c', fontWeight: 600 }}>- ₹{Math.round(totalDiscount).toLocaleString('en-IN')}</span>
                </div>
                {/* No Promise Fee, No Coupon */}
                <div style={{ borderTop: '1px solid #eee', margin: '16px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                  <span>Total Amount</span>
                  <span>₹{Math.round(totalAmount).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ color: '#388e3c', fontWeight: 600, fontSize: 16, marginTop: 8 }}>
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

export default Cart;
