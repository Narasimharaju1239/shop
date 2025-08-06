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
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

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
    if (user && user.token) fetchCart();
  }, [user, user?._id, user?.id, user?.token]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const res = await API.post('/cart/add', { productId: product._id });
      setCartItems(res.data.items);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const res = await API.post('/cart/remove', { productId });
      setCartItems(res.data.items);
    } catch {
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = async () => {
    if (!user) return;
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
