import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { currentTheme } = useTheme();
  
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .owner-dashboard-container {
            padding: 20px !important;
          }
          .dashboard-card {
            padding: 30px 24px !important;
            margin: 20px !important;
          }
          .dashboard-title {
            font-size: 28px !important;
            margin-bottom: 16px !important;
          }
          .dashboard-description {
            font-size: 16px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .quick-actions {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .owner-dashboard-container {
            padding: 16px !important;
          }
          .dashboard-card {
            padding: 24px 20px !important;
            margin: 16px !important;
          }
          .dashboard-title {
            font-size: 24px !important;
          }
          .dashboard-description {
            font-size: 15px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .stat-card {
            padding: 16px !important;
          }
          .action-button {
            padding: 12px 16px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
      
      <div 
        className="owner-dashboard-container"
        style={{
          padding: '30px',
          background: currentTheme.background,
          color: currentTheme.text,
          minHeight: 'calc(100vh - 56px)',
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        <div 
          className="dashboard-card"
          style={{
            background: currentTheme.surface,
            boxShadow: `0 8px 32px ${currentTheme.shadow}`,
            borderRadius: '20px',
            padding: '40px 32px',
            textAlign: 'center',
            marginBottom: '30px',
            border: `1px solid ${currentTheme.border}`
          }}
        >
          <h1 
            className="dashboard-title"
            style={{
              color: currentTheme.primary,
              marginBottom: '20px',
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}
          >
            Owner Dashboard
          </h1>
          <p 
            className="dashboard-description"
            style={{
              fontSize: '18px',
              color: currentTheme.textSecondary,
              marginBottom: '0',
              fontWeight: '500',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Manage your companies, products, offers and track customer orders all from one centralized dashboard.
          </p>
        </div>

        <div 
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '30px'
          }}
        >
          <div 
            className="stat-card"
            style={{
              background: currentTheme.surface,
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Companies
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '14px',
              margin: 0
            }}>
              Manage your business entities
            </p>
          </div>

          <div 
            className="stat-card"
            style={{
              background: currentTheme.surface,
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#fff'
            }}>
              📦
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Products
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '14px',
              margin: 0
            }}>
              Add and manage inventory
            </p>
          </div>

          <div 
            className="stat-card"
            style={{
              background: currentTheme.surface,
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#fff'
            }}>
              📋
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Orders
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '14px',
              margin: 0
            }}>
              Track customer orders
            </p>
          </div>

          <div 
            className="stat-card"
            style={{
              background: currentTheme.surface,
              padding: '24px',
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#fff'
            }}>
              🎯
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Offers
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '14px',
              margin: 0
            }}>
              Create special deals
            </p>
          </div>
        </div>

        <div 
          className="quick-actions"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          <button
            className="action-button"
            style={{
              background: currentTheme.button,
              color: currentTheme.buttonText,
              border: 'none',
              borderRadius: '12px',
              padding: '16px 20px',
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
            onClick={() => window.location.href = '/owner/companies'}
          >
            Manage Companies
          </button>

          <button
            className="action-button"
            style={{
              background: currentTheme.surface,
              color: currentTheme.text,
              border: `2px solid ${currentTheme.button}`,
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = currentTheme.button;
              e.currentTarget.style.color = currentTheme.buttonText;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.background = currentTheme.surface;
              e.currentTarget.style.color = currentTheme.text;
            }}
            onClick={() => window.location.href = '/owner/products'}
          >
            Manage Products
          </button>

          <button
            className="action-button"
            style={{
              background: currentTheme.surface,
              color: currentTheme.text,
              border: `2px solid ${currentTheme.button}`,
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = currentTheme.button;
              e.currentTarget.style.color = currentTheme.buttonText;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.background = currentTheme.surface;
              e.currentTarget.style.color = currentTheme.text;
            }}
            onClick={() => window.location.href = '/owner/orders'}
          >
            View Orders
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
