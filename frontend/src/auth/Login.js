import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import API from '../utils/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { mergeGuestCartToCustomerCart } = useContext(CartContext);
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  // Hide scrollbars but allow scrolling
  React.useEffect(() => {
    // Hide scrollbar but allow scrolling
    document.documentElement.style.scrollbarWidth = 'none'; // Firefox
    document.documentElement.style.msOverflowStyle = 'none'; // IE/Edge
    
    // Add CSS to hide scrollbar for webkit browsers
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        display: none;
      }
      body {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.documentElement.style.scrollbarWidth = '';
      document.documentElement.style.msOverflowStyle = '';
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      // Merge guest cart to customer cart after login
      await mergeGuestCartToCustomerCart();
      if (res.data.role === 'owner') navigate('/owner/home');
      else navigate('/customer/home');
    } catch (err) {
      alert('Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: currentTheme.background,
      color: currentTheme.text
    }}>
      <Navbar />
      
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        minHeight: 'calc(100vh - 140px)' // Account for navbar and footer
      }}>
        <div style={{
          background: currentTheme.card,
          padding: '30px',
          borderRadius: '8px',
          boxShadow: `0 4px 6px ${currentTheme.shadow}`,
          width: '100%',
          maxWidth: '400px',
          border: `1px solid ${currentTheme.border}`
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '25px',
            color: currentTheme.text,
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  background: currentTheme.input,
                  color: currentTheme.text,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  background: currentTheme.input,
                  color: currentTheme.text,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '25px' 
            }}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ marginRight: '8px' }}
              />
              <label 
                htmlFor="showPassword" 
                style={{ 
                  fontSize: '14px', 
                  color: currentTheme.textSecondary, 
                  cursor: 'pointer' 
                }}
              >
                Show Password
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: isLoading ? currentTheme.textSecondary : currentTheme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '20px'
              }}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>

            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: currentTheme.textSecondary
            }}>
              <a 
                href="/signup" 
                style={{ 
                  color: currentTheme.primary, 
                  textDecoration: 'none',
                  marginRight: '15px'
                }}
              >
                Sign Up
              </a>
              |
              <a 
                href="/forgot-password" 
                style={{ 
                  color: currentTheme.primary, 
                  textDecoration: 'none',
                  marginLeft: '15px'
                }}
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
