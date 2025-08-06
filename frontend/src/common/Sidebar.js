import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ role, visible, isMobile, username = 'User' }) => {
  const { currentTheme } = useTheme();
  const location = useLocation();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Fetch pending orders count for owner
  useEffect(() => {
    const fetchPendingOrdersCount = async () => {
      if (role === 'owner') {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.log('No token found, skipping pending orders fetch');
            return;
          }
          
          const response = await fetch('http://localhost:5000/api/orders/pending-count', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.status === 401) {
            console.log('Token expired or invalid, user needs to re-login');
            // Optionally redirect to login or refresh token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return;
          }
          
          if (response.ok) {
            const data = await response.json();
            setPendingOrdersCount(data.count);
          }
        } catch (error) {
          console.error('Error fetching pending orders count:', error);
        }
      }
    };

    fetchPendingOrdersCount();
    
    // Refresh count every 30 seconds to get real-time updates
    const interval = setInterval(fetchPendingOrdersCount, 30000);
    
    return () => clearInterval(interval);
  }, [role]);

  if (!visible) return null;
  
  const menuItemStyle = {
    color: currentTheme.textSecondary,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: '2px 0',
    fontWeight: '500',
    fontSize: '15px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    padding: '12px 20px',
    borderRadius: '0',
    background: 'transparent',
    transition: 'all 0.2s ease',
    width: '100%',
    boxSizing: 'border-box',
    border: 'none',
    cursor: 'pointer',
    position: 'relative'
  };

  const getActiveMenuItemStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      ...menuItemStyle,
      background: isActive ? `${currentTheme.primary}15` : 'transparent',
      color: isActive ? currentTheme.primary : currentTheme.textSecondary,
      fontWeight: isActive ? '600' : '500',
      borderLeft: isActive ? `4px solid ${currentTheme.primary}` : '4px solid transparent',
      paddingLeft: isActive ? '16px' : '20px'
    };
  };
  
  return (
    <>
      <style>{`
        .sidebar-menu-item:hover {
          background-color: ${currentTheme.hover} !important;
          color: ${currentTheme.text} !important;
        }
        .sidebar-menu-item.active {
          background-color: ${currentTheme.primary}15 !important;
          color: ${currentTheme.primary} !important;
          font-weight: 600 !important;
          border-left: 4px solid ${currentTheme.primary} !important;
        }
        .sidebar-menu-item.active:hover {
          background-color: ${currentTheme.primary}25 !important;
          color: ${currentTheme.primary} !important;
        }
        .theme-toggle-container:hover {
          background-color: ${currentTheme.hover} !important;
          color: ${currentTheme.text} !important;
        }
        @media (max-width: 768px) {
          .responsive-sidebar {
            width: 280px !important;
            left: ${visible ? '0' : '-280px'} !important;
            z-index: 99 !important;
            box-shadow: 2px 0 20px ${currentTheme.shadow} !important;
          }
        }
        @media (min-width: 769px) {
          .responsive-sidebar {
            left: ${visible ? '0' : '-260px'} !important;
          }
        }
      `}</style>
      
      <div 
        className="responsive-sidebar"
        style={{
          position: 'fixed',
          top: 56,
          left: visible ? 0 : '-260px',
          width: '260px',
          height: 'calc(100vh - 56px)',
          background: currentTheme.sidebar,
          color: currentTheme.text,
          padding: '0',
          boxSizing: 'border-box',
          boxShadow: `2px 0 12px ${currentTheme.shadow}`,
          borderRight: `1px solid ${currentTheme.border}`,
          zIndex: 99,
          borderRadius: 0,
          transition: 'all 0.3s ease',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
      
        {/* User Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: `1px solid ${currentTheme.border}`,
          background: currentTheme.surface
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '25px',
              fontWeight: '700',
              color: currentTheme.text,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '-0.5px',
              textTransform: 'uppercase'
            }}>
              {username || 'USER'}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 0', flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            
            {/* Dashboard */}
            <li>
              <Link 
                to={role === 'owner' ? '/owner/home' : '/customer/home'} 
                className="sidebar-menu-item"
                style={getActiveMenuItemStyle(role === 'owner' ? '/owner/home' : '/customer/home')}
              >
                <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Dashboard
              </Link>
            </li>

            {role === 'owner' && (
              <>
                <li>
                  <Link to="/owner/companies" className="sidebar-menu-item" style={getActiveMenuItemStyle('/owner/companies')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18M7.5 9.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/owner/products" className="sidebar-menu-item" style={getActiveMenuItemStyle('/owner/products')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/owner/orders" className="sidebar-menu-item" style={getActiveMenuItemStyle('/owner/orders')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h6m-15-3V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25V19.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5V9zm0 0h15" />
                    </svg>
                    Manage Orders
                    {pendingOrdersCount > 0 && (
                      <span style={{
                        marginLeft: 'auto',
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        minWidth: '20px',
                        textAlign: 'center'
                      }}>
                        {pendingOrdersCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link to="/owner/offers" className="sidebar-menu-item" style={getActiveMenuItemStyle('/owner/offers')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
                    </svg>
                    Offers Manager
                  </Link>
                </li>
              </>
            )}
            
            {role === 'customer' && (
              <>
                <li>
                  <Link to="/customer/companies" className="sidebar-menu-item" style={getActiveMenuItemStyle('/customer/companies')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/customer/products" className="sidebar-menu-item" style={getActiveMenuItemStyle('/customer/products')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/customer/cart" className="sidebar-menu-item" style={getActiveMenuItemStyle('/customer/cart')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/customer/orders" className="sidebar-menu-item" style={getActiveMenuItemStyle('/customer/orders')}>
                    <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h6m-15-3V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25V19.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5V9zm0 0h15" />
                    </svg>
                    My Orders
                  </Link>
                </li>
              </>
            )}
            
            <li>
              <Link to="/profile" className="sidebar-menu-item" style={getActiveMenuItemStyle('/profile')}>
                <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Settings Section */}
        <div style={{
          borderTop: `1px solid ${currentTheme.border}`,
          padding: '50px 0'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <Link to="/change-password" className="sidebar-menu-item" style={getActiveMenuItemStyle('/change-password')}>
                <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </li>
            <li>
              <Link to="/contactus" className="sidebar-menu-item" style={getActiveMenuItemStyle('/contactus')}>
                <svg style={{ width: '18px', height: '18px', marginRight: '12px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                Support
              </Link>
            </li>
            
            {/* Theme Toggle */}
            <li>
              <div className="sidebar-menu-item theme-toggle-container" style={{
                ...menuItemStyle,
                cursor: 'pointer',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '0',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <svg style={{ width: '18px', height: '18px', stroke: 'currentColor', fill: 'none' }} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636a9 9 0 1012.728 0z" />
                  </svg>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: 'currentColor'
                  }}>
                    Theme
                  </span>
                </div>
                <div style={{ marginLeft: '8px' }}>
                  <ThemeToggle style={{
                    fontSize: '14px',
                    minWidth: '70px',
                    height: '28px',
                    borderRadius: '20px',
                    border: `2px solid ${currentTheme.border}`,
                    background: currentTheme.surface,
                    color: currentTheme.text,
                    fontWeight: '600',
                    boxShadow: `0 2px 4px ${currentTheme.shadow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} />
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </>
  );
};

export default Sidebar;

<Sidebar 
  role="customer" 
  visible={true} 
  username="John Doe"  // Make sure to pass the actual username here
/>
