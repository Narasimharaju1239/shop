import React, { useEffect } from 'react';
import RoutesConfig from './routes';
import Notification from './common/Notification';
import SessionProtection from './components/SessionProtection';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const ThemedApp = () => {
  const { currentTheme } = useTheme();
  
  useEffect(() => {
    if (window.location.pathname === '/test-toast') {
      // Only show on a test route to avoid spamming users
      // Remove this after confirming toast works
      import('react-toastify').then(({ toast }) => toast.info('Toast test!'));
    }
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      background: currentTheme.background, 
      color: currentTheme.text,
      minHeight: '100vh', 
      margin: 0, 
      padding: 0,
      transition: 'all 0.2s ease'
    }}>
      <CartProvider>
        <SessionProtection />
        <Notification />
        <RoutesConfig />
      </CartProvider>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
