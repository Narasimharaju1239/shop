import React, { useContext, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Notification from './Notification';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { currentTheme } = useTheme();
  const role = user?.role || 'customer';
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when screen size changes
      if (mobile && sidebarVisible) {
        setSidebarVisible(false);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarVisible]);

  const handleMenuClick = () => setSidebarVisible(v => !v);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .layout-main {
            margin-left: 0 !important;
            padding: 10px !important;
          }
          .mobile-overlay {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-overlay {
            display: none !important;
          }
        }
      `}</style>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: currentTheme.background,
        color: currentTheme.text,
        transition: 'all 0.2s ease'
      }}>
        <Notification />
        <Navbar onMenuClick={handleMenuClick} />
        
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Sidebar 
            role={role} 
            visible={sidebarVisible} 
            isMobile={isMobile} 
            username={user?.name || 'User'}
          />
          
          {/* Mobile Overlay */}
          {sidebarVisible && isMobile && (
            <div 
              className="mobile-overlay"
              onClick={handleOverlayClick}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 98,
                display: 'none'
              }}
            />
          )}
          
          <main 
            className="layout-main"
            style={{ 
              flex: 1, 
              padding: '20px',
              marginLeft: (sidebarVisible && !isMobile) ? 260 : 0,
              marginTop: '56px', // Account for fixed navbar
              transition: 'margin-left 0.2s ease',
              minHeight: 'calc(100vh - 56px - 60px)', // Account for navbar and footer
              maxWidth: '100%',
              overflow: 'auto'
            }}
          >
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%'
            }}>
              {children}
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Layout;
