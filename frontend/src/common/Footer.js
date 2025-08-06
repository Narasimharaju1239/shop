import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { currentTheme } = useTheme();
  
  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding-bottom: 0; /* Remove padding to eliminate white space */
        }
        
        @media (max-width: 768px) {
          .footer-responsive {
            font-size: 12px !important;
            padding: 8px 6px !important;
          }
          body {
            padding-bottom: 0 !important; /* Remove padding */
          }
        }
        @media (max-width: 480px) {
          .footer-responsive {
            font-size: 10px !important;
            padding: 6px 4px !important;
          }
          body {
            padding-bottom: 0 !important; /* Remove padding */
          }
        }
        
        /* Ensure main content doesn't overlap with fixed footer */
        .main-content {
          padding-bottom: 60px;
        }
        
        /* Hide horizontal scroll */
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
      `}</style>
      
      <footer 
        className="footer-responsive"
        style={{
          background: currentTheme.surface,
          color: currentTheme.text,
          padding: '15px 20px',
          textAlign: 'center',
          fontWeight: 500,
          fontSize: '14px',
          borderTop: `1px solid ${currentTheme.border}`,
          width: '100%',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 100
        }}
      >
        &copy; {new Date().getFullYear()} Sri Santhoshimatha Aqua Bazar. All Rights Reserved.
      </footer>
    </>
  );
};

export default Footer;
