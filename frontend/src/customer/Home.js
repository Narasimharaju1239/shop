import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { currentTheme } = useTheme();
  
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .home-container {
            padding: 20px !important;
          }
          .home-title {
            font-size: 24px !important;
            margin-bottom: 16px !important;
          }
          .home-description {
            font-size: 16px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .home-container {
            padding: 16px !important;
          }
          .home-title {
            font-size: 22px !important;
          }
          .home-description {
            font-size: 15px !important;
          }
          .feature-card {
            padding: 16px !important;
          }
        }
      `}</style>
      
      <div 
        className="home-container"
        style={{
          padding: '40px 30px',
          textAlign: 'center',
          background: currentTheme.background,
          color: currentTheme.text,
          minHeight: 'calc(100vh - 56px)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div style={{
          background: currentTheme.surface,
          borderRadius: '20px',
          padding: '40px 30px',
          marginBottom: '40px',
          border: `1px solid ${currentTheme.border}`,
          boxShadow: `0 8px 32px ${currentTheme.shadow}`
        }}>
          <h1 
            className="home-title"
            style={{ 
              color: currentTheme.primary, 
              marginBottom: '20px',
              fontSize: '32px',
              fontWeight: '700',
              lineHeight: '1.2'
            }}
          >
            Welcome to Sri Santhoshimatha Aqua Bazar
          </h1>
          <p 
            className="home-description"
            style={{ 
              fontSize: '18px',
              color: currentTheme.textSecondary,
              lineHeight: '1.6',
              marginBottom: '30px',
              maxWidth: '600px',
              margin: '0 auto 30px'
            }}
          >
            Explore premium aqua feeds and fish medicines from top brands. Discover quality products that help your aquatic life thrive.
          </p>
          <button
            style={{
              background: currentTheme.button,
              color: currentTheme.buttonText,
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${currentTheme.shadow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.shadow}`;
            }}
            onClick={() => window.location.href = '/customer/companies'}
          >
            Start Shopping
          </button>
        </div>

        <div 
          className="features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginTop: '40px'
          }}
        >
          <div 
            className="feature-card"
            style={{
              background: currentTheme.surface,
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: currentTheme.primary,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#fff'
            }}>
              🏢
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Top Brands
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Browse products from trusted aqua feed and medicine companies
            </p>
          </div>

          <div 
            className="feature-card"
            style={{
              background: currentTheme.surface,
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: currentTheme.primary,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#fff'
            }}>
              🛒
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Easy Shopping
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Simple and secure checkout process with order tracking
            </p>
          </div>

          <div 
            className="feature-card"
            style={{
              background: currentTheme.surface,
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: currentTheme.primary,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#fff'
            }}>
              🚚
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Fast Delivery
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Quick and reliable delivery of your aqua products
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
