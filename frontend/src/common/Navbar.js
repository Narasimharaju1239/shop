import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style>{`
        /* Hide scrollbars visually but allow scrolling */
        html, body {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        /* Responsive Navbar */
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 12px !important;
          }
          .navbar-title {
            font-size: 16px !important;
            margin-left: 8px !important;
          }
          .navbar-links {
            gap: 4px !important;
          }
          .navbar-link {
            font-size: 13px !important;
            padding: 4px 6px !important;
            margin: 0 2px !important;
          }
          .navbar-logout {
            font-size: 13px !important;
            padding: 4px 8px !important;
            margin-right: 12px !important;
          }
          .hamburger-menu {
            padding: 4px 6px !important;
            margin-right: 4px !important;
          }
        }
        
        @media (max-width: 480px) {
          .navbar-title {
            font-size: 14px !important;
            display: none !important;
          }
          .navbar-links {
            flex-wrap: wrap !important;
          }
          .navbar-link {
            font-size: 12px !important;
          }
        }
      `}</style>
      <nav 
        className="navbar-container"
        style={{
          background: currentTheme.navbar,
          color: currentTheme.text,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          height: 56,
          minHeight: 56,
          boxShadow: `0 2px 8px ${currentTheme.shadow}`,
          borderBottom: `1px solid ${currentTheme.border}`,
          borderRadius: 0,
          zIndex: 100,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100vw',
          overflow: 'visible',
          transition: 'all 0.2s ease',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '0 0 auto', height: '100%' }}>
          {!(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') && (
            <button
              onClick={onMenuClick}
              className="hamburger-menu"
              style={{
                background: currentTheme.navbar,
                border: 'none',
                color: currentTheme.text,
                fontSize: 22,
                marginRight: 8,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                lineHeight: 1,
                transition: 'background 0.2s',
              }}
              aria-label="Open sidebar menu"
              onMouseOver={e => {
                e.currentTarget.style.background = currentTheme.hover;
                e.currentTarget.querySelector('span').style.color = currentTheme.text;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = currentTheme.navbar;
                e.currentTarget.querySelector('span').style.color = currentTheme.text;
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: 22, letterSpacing: 2, color: currentTheme.text, transition: 'color 0.2s' }}>☰</span>
            </button>
          )}
          <span className="navbar-title" style={{ fontWeight: 500, fontSize: '20px', color: currentTheme.text, letterSpacing: 1, marginLeft: 4 }}>
            Sri Santhoshimatha Aqua Bazar
          </span>
        </div>
        <div className="nav-links navbar-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'nowrap',
          minWidth: 0,
          justifyContent: 'flex-end',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          flex: 1,
        }}>
          <Link to="/about" className="navbar-link" style={{ ...linkStyle(currentTheme), marginLeft: 24, marginRight: 4 }}>
            About
          </Link>
          <Link to="/contactus" className="navbar-link" style={{ ...linkStyle(currentTheme), marginLeft: 8, marginRight: 40 }}>
            Contact Us
          </Link>
          
          {user && (
            <>
              <button 
                onClick={handleLogout} 
                className="navbar-logout"
                style={{
                  background: currentTheme.navbar,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.border}`,
                  marginLeft: '8px',
                  marginRight: '40px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  borderRadius: 5,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  minWidth: 70,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 15,
                  flexShrink: 1,
                  transition: 'all 0.2s ease',
                }}
              onMouseOver={e => {
                e.currentTarget.style.background = currentTheme.hover;
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = currentTheme.navbar;
              }}
              >Logout</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

const linkStyle = (theme) => ({
  color: theme.text,
  textDecoration: 'none',
  margin: '0 2px',
  fontWeight: 500,
  fontSize: 15,
  borderRadius: 4,
  padding: '6px 10px',
  background: 'transparent',
  transition: 'color 0.2s, background 0.2s',
  display: 'inline-block',
});

export default Navbar;
