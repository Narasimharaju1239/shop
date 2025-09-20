import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';

const Navbar = ({ onMenuClick, search, setSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const { currentTheme } = useTheme();
  const { cartItems } = useContext(CartContext);
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
        @media (max-width: 900px) {
          .navbar-container {
            padding: 0 8px !important;
            height: 60px !important;
          }
          .navbar-title {
            font-size: 18px !important;
            margin-left: 6px !important;
          }
          .navbar-links {
            gap: 2px !important;
          }
          .navbar-link {
            font-size: 13px !important;
            padding: 4px 6px !important;
            margin: 0 2px !important;
          }
          .navbar-logout {
            font-size: 13px !important;
            padding: 4px 8px !important;
            margin-right: 8px !important;
          }
          .hamburger-menu {
            padding: 4px 6px !important;
            margin-right: 2px !important;
          }
          .navbar-container img {
            height: 48px !important;
          }
        }

        @media (max-width: 600px) {
          .navbar-container {
            flex-direction: column !important;
            height: auto !important;
            padding: 0 4px !important;
          }
          .navbar-title {
            font-size: 15px !important;
            margin-left: 2px !important;
          }
          .navbar-links {
            flex-wrap: wrap !important;
            gap: 1px !important;
          }
          .navbar-link {
            font-size: 11px !important;
            padding: 3px 4px !important;
            margin: 0 1px !important;
          }
          .navbar-logout {
            font-size: 11px !important;
            padding: 3px 6px !important;
            margin-right: 4px !important;
          }
          .hamburger-menu {
            padding: 3px 4px !important;
            margin-right: 1px !important;
          }
          .navbar-container img {
            height: 36px !important;
          }
          .navbar-container > div {
            flex-direction: column !important;
            gap: 4px !important;
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
          height: location.pathname === '/' ? 80 : 60,
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
          {user && !(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') && (
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
          {location.pathname === '/' ? (
            <img src="/logo.png" alt="Shop Logo" style={{ height: 80, width: 'auto', marginLeft: 4 }} />
          ) : (
            <span className="navbar-title" style={{ fontWeight: 500, fontSize: '25px', color: currentTheme.text, letterSpacing: 1, marginLeft: 4 }}>
              Sri Santhoshimatha Aqua Bazar
            </span>
          )}
        </div>
        {/* Search bar only on landing page */}
        {location.pathname === '/' && (
          <>
            {/* Companies Button */}
            <Link
              to="/customer/companies"
              style={{
                padding: '10px 18px',
                background: 'transparent',
                color: '#111',
                fontWeight: 70,
                fontSize: 16,
                borderRadius: '8px',
                textDecoration: 'none',
                marginLeft: '220px',
                marginRight: '18px',
                boxShadow: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Companies
            </Link>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flex: 1,
              maxWidth: '500px',
              background: '#f5f7fa', // Light color for search bar
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)', // Subtle shadow
              padding: '6px 12px',
              marginLeft: '18px',
              marginRight: '18px',
            }}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: '16px',
                  border: 'none',
                  outline: 'none',
                  borderRadius: '8px',
                  minWidth: '180px',
                  background: '#f5f7fa', // Match container
                }}
              />
              <button
                style={{
                  padding: '10px 20px',
                  background: currentTheme.button,
                  color: currentTheme.buttonText,
                  fontWeight: '700',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                }}
              >
                🔍 Search
              </button>
            </div>
            {/* Show both guest and customer cart icons in navbar, side by side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Guest cart icon (always visible) */}
              <div
                style={{ display: 'flex', alignItems: 'flex-end', cursor: 'pointer', position: 'relative', height: 38, width: 54, justifyContent: 'center', marginLeft: '18px', marginRight: '6px' }}
                onClick={() => {
                  navigate('/guest/cart');
                }}
              >
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M4 8H8L12 26H30L34 12H10" stroke="#111" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <circle cx="14" cy="32" r="3" fill="#111" />
                    <circle cx="28" cy="32" r="3" fill="#111" />
                    <line x1="10" y1="12" x2="32" y2="12" stroke="#111" strokeWidth="2" />
                    <line x1="12" y1="18" x2="30" y2="18" stroke="#111" strokeWidth="2" />
                    <line x1="14" y1="12" x2="14" y2="26" stroke="#111" strokeWidth="2" />
                    <line x1="20" y1="12" x2="20" y2="26" stroke="#111" strokeWidth="2" />
                    <line x1="26" y1="12" x2="26" y2="26" stroke="#111" strokeWidth="2" />
                  </g>
                </svg>
                {/* Show guest cart count only for guests */}
                {(!user) && (() => {
                  const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
                  return guestCart.length > 0 ? (
                    <span style={{ position: 'absolute', top: -6, left: '70%', transform: 'translateX(-50%)', color: '#111', fontSize: 15, fontWeight: 600, minWidth: 28, textAlign: 'center', zIndex: 2 }}>
                      {guestCart.length}
                    </span>
                  ) : null;
                })()}
              </div>
              {/* Customer cart icon (only for logged-in users) */}
              {user && (
                <div
                  style={{ display: 'flex', alignItems: 'flex-end', cursor: 'pointer', position: 'relative', height: 38, width: 54, justifyContent: 'center', marginLeft: '6px', marginRight: '18px' }}
                  onClick={() => {
                    navigate('/customer/cart');
                  }}
                >
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M4 8H8L12 26H30L34 12H10" stroke="#00796b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <circle cx="14" cy="32" r="3" fill="#00796b" />
                      <circle cx="28" cy="32" r="3" fill="#00796b" />
                      <line x1="10" y1="12" x2="32" y2="12" stroke="#00796b" strokeWidth="2" />
                      <line x1="12" y1="18" x2="30" y2="18" stroke="#00796b" strokeWidth="2" />
                      <line x1="14" y1="12" x2="14" y2="26" stroke="#00796b" strokeWidth="2" />
                      <line x1="20" y1="12" x2="20" y2="26" stroke="#00796b" strokeWidth="2" />
                      <line x1="26" y1="12" x2="26" y2="26" stroke="#00796b" strokeWidth="2" />
                    </g>
                  </svg>
                  {/* Show customer cart count only for logged-in users */}
                  {cartItems.length > 0 && (
                    <span style={{ position: 'absolute', top: -6, left: '70%', transform: 'translateX(-50%)', color: '#00796b', fontSize: 15, fontWeight: 600, minWidth: 28, textAlign: 'center', zIndex: 2 }}>
                      {cartItems.length}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
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
          <Link to="/about" className="navbar-link" style={{ ...linkStyle(currentTheme), marginLeft: 20, marginRight: 4 }}>
            About
          </Link>
          <Link to="/contactus" className="navbar-link" style={{ ...linkStyle(currentTheme), marginLeft: 1, marginRight: 15 }}>
            Contact Us
          </Link>
          {/* Show Sign In button if not logged in */}
          {!user && (
            <Link
              to="/login"
              className="navbar-link"
              style={{
                ...linkStyle(currentTheme),
                background: currentTheme.button,
                color: currentTheme.buttonText,
                fontWeight: 700,
                border: 'none',
                marginLeft: '8px',
                marginRight: '50px',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: 16,
                boxShadow: `0 2px 8px ${currentTheme.shadow}`,
                transition: 'all 0.2s',
              }}
            >
              Sign In
            </Link>
          )}
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
