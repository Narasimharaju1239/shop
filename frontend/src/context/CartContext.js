import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Get or create guestId for guest users
  const getGuestId = () => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  };

  // Merge guest cart into customer cart after login
  const mergeGuestCartToCustomerCart = async () => {
    const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (user && user.token && guestCart.length > 0) {
      try {
        // Send each guest cart item to backend
        for (const item of guestCart) {
          await API.post('/cart/add', { productId: item._id, quantity: item.quantity || 1 });
        }
        // Fetch updated cart from backend
        const res = await API.get('/cart');
        setCartItems(res.data.items || []);
        localStorage.setItem('cartItems', JSON.stringify([])); // Clear guest cart
      } catch {
        // Handle error silently
      }
    }
  };
  const { user } = useContext(AuthContext);
  // Initialize cartItems from backend (guests: guest-cart API, users: cart API)
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend (guests: guest-cart API, users: cart API)
  useEffect(() => {
    const fetchCart = async () => {
      if (user && (user._id || user.id) && user.token) {
        setLoading(true);
        try {
          const res = await API.get('/cart');
          setCartItems(res.data.items || []);
        } catch (e) {
          setCartItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        // Guest: fetch from guest-cart API
        const guestId = getGuestId();
        try {
          const res = await API.get(`/guest-cart/${guestId}`);
          setCartItems(res.data.items || []);
        } catch (e) {
          setCartItems([]);
        }
      }
    };
    fetchCart();
    // eslint-disable-next-line
  }, [user, user?._id, user?.id, user?.token]);



  const addToCart = async (product) => {
    if (!user) {
      // Guest: add to guest cart in MongoDB
      const guestId = getGuestId();
      try {
        const res = await API.post('/guest-cart/add', { guestId, productId: product._id, quantity: 1 });
        setCartItems(res.data.items || []);
        toast.success(`${product.name} added to cart!`);
      } catch {
        toast.error('Failed to add to cart');
      }
      return;
    }
    // Logged-in user: add to backend cart
    try {
      const res = await API.post('/cart/add', { productId: product._id });
      setCartItems(res.data.items);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      // Guest: remove from guest cart in MongoDB
      const guestId = getGuestId();
      try {
        const res = await API.post('/guest-cart/remove', { guestId, productId });
        setCartItems(res.data.items || []);
      } catch {
        toast.error('Failed to remove from cart');
      }
      return;
    }
    // Logged-in user: remove from backend cart
    try {
      const res = await API.post('/cart/remove', { productId });
      setCartItems(res.data.items);
    } catch {
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Guest: clear guest cart in MongoDB
      const guestId = getGuestId();
      try {
        await API.post('/guest-cart/clear', { guestId });
        setCartItems([]);
      } catch {
        toast.error('Failed to clear cart');
      }
      return;
    }
    // Logged-in user: clear backend cart
    try {
      await API.post('/cart/clear');
      setCartItems([]);
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  return (
  <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, loading, setCartItems, mergeGuestCartToCustomerCart }}>
      {children}
    </CartContext.Provider>
  );
};
