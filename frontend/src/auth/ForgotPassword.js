import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentTheme } = useTheme();

  // Hide scrollbars but allow scrolling
  React.useEffect(() => {
    document.documentElement.style.scrollbarWidth = 'none';
    document.documentElement.style.msOverflowStyle = 'none';
    
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
      await API.post('/auth/forgot-password', { email });
      toast.success('Reset link sent to your email!');
    } catch {
      toast.error('Failed to send email.');
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
        padding: '20px'
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
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: currentTheme.textSecondary
            }}>
              Remember your password?{' '}
              <a 
                href="/login" 
                style={{ 
                  color: currentTheme.primary, 
                  textDecoration: 'none'
                }}
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
