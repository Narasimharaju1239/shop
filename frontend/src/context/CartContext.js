import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Initialize cartItems from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Save cartItems to localStorage whenever they change
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Fetch cart from backend when user logs in
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
      }
    };
    if (user && user.token) {
      fetchCart();
    } else {
      // If user logs out, reset to guest cart from localStorage
      const saved = localStorage.getItem('cartItems');
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [user, user?._id, user?.id, user?.token]);

  const addToCart = async (product) => {
    if (!user) {
      // Guest: add to local cart
      const exists = cartItems.find(item => item._id === product._id);
      let updated;
      if (exists) {
        updated = cartItems.map(item =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        updated = [...cartItems, { ...product, quantity: 1 }];
      }
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
      toast.success(`${product.name} added to cart!`);
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
      // Guest: remove from local cart
      const updated = cartItems.filter(item => item._id !== productId);
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
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
      // Guest: clear local cart
      setCartItems([]);
      localStorage.setItem('cartItems', JSON.stringify([]));
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, loading, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
