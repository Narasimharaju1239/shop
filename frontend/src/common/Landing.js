import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Landing = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .landing-hero {
            padding: 30px 20px !important;
          }
          .landing-title {
            font-size: 28px !important;
            margin-bottom: 16px !important;
          }
          .landing-description {
            font-size: 16px !important;
            margin-bottom: 24px !important;
          }
          .landing-buttons {
            flex-direction: column !important;
            gap: 12px !important;
            width: 100% !important;
          }
          .landing-button {
            width: 100% !important;
            max-width: 280px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 30px 20px !important;
          }
          .feature-card {
            padding: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .landing-hero {
            padding: 20px 16px !important;
          }
          .landing-title {
            font-size: 24px !important;
          }
          .landing-description {
            font-size: 15px !important;
          }
          .feature-card {
            padding: 16px !important;
          }
          .feature-card h3 {
            font-size: 18px !important;
          }
        }
        
        .landing-hero {
          background: linear-gradient(135deg, ${currentTheme.primary}15 0%, ${currentTheme.primary}08 100%);
        }
        
        .landing-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${currentTheme.shadow};
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        background: currentTheme.background,
        color: currentTheme.text,
        paddingBottom: '60px' /* Add padding for fixed footer */
      }}>
        <Navbar />
        
        <div 
          className="landing-hero"
          style={{
            minHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '50px 30px',
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
          {/* Decorative background elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            background: `${currentTheme.primary}10`,
            borderRadius: '50%',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '150px',
            height: '150px',
            background: `${currentTheme.primary}08`,
            borderRadius: '30px',
            transform: 'rotate(45deg)',
            zIndex: 0
          }} />
          
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
            <div style={{
              background: currentTheme.surface,
              borderRadius: '24px',
              padding: '50px 40px',
              marginBottom: '40px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 20px 60px ${currentTheme.shadow}`,
              backdropFilter: 'blur(10px)'
            }}>
              <h1 
                className="landing-title"
                style={{ 
                  fontSize: '42px', 
                  color: currentTheme.primary, 
                  marginBottom: '20px',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.primary}80 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Welcome to Sri Santhoshimatha Aqua Bazar
              </h1>
              <p 
                className="landing-description"
                style={{ 
                  fontSize: '20px', 
                  maxWidth: '700px', 
                  marginBottom: '35px',
                  color: currentTheme.textSecondary,
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}
              >
                Discover premium aqua feeds, fish medicines, and aquaculture solutions from trusted companies. 
                Your one-stop destination for quality aquatic products.
              </p>
              <div 
                className="landing-buttons"
                style={{ 
                  display: 'flex', 
                  gap: '20px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <button
                  className="landing-button"
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '16px 32px',
                    background: currentTheme.button,
                    color: currentTheme.buttonText,
                    fontSize: '18px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxShadow: `0 4px 15px ${currentTheme.shadow}`,
                    minWidth: '140px'
                  }}
                >
                  Login
                </button>
                <button
                  className="landing-button"
                  onClick={() => navigate('/signup')}
                  style={{
                    padding: '16px 32px',
                    background: currentTheme.surface,
                    color: currentTheme.text,
                    fontSize: '18px',
                    fontWeight: '600',
                    border: `2px solid ${currentTheme.button}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxShadow: `0 4px 15px ${currentTheme.shadow}`,
                    minWidth: '140px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = currentTheme.button;
                    e.currentTarget.style.color = currentTheme.buttonText;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = currentTheme.surface;
                    e.currentTarget.style.color = currentTheme.text;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div 
          className="features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            padding: '50px 30px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: currentTheme.background
          }}
        >
          <div 
            className="feature-card"
            style={{
              background: currentTheme.surface,
              padding: '30px',
              borderRadius: '20px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 8px 30px ${currentTheme.shadow}`,
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px'
            }}>
              🏢
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '15px',
              fontSize: '22px',
              fontWeight: '700'
            }}>
              Trusted Brands
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '16px',
              lineHeight: '1.6',
              margin: 0
            }}>
              Partner with established aquaculture companies offering proven, high-quality products for your business needs.
            </p>
          </div>

          <div 
            className="feature-card"
            style={{
              background: currentTheme.surface,
              padding: '30px',
              borderRadius: '20px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 8px 30px ${currentTheme.shadow}`,
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px'
            }}>
              🛒
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '15px',
              fontSize: '22px',
              fontWeight: '700'
            }}>
              Easy Shopping
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '16px',
              lineHeight: '1.6',
              margin: 0
            }}>
              Browse, compare, and purchase aqua products with our intuitive interface and secure checkout process.
            </p>
          </div>

          <div 
            className="feature-card"
            style={{
              background: currentTheme.surface,
              padding: '30px',
              borderRadius: '20px',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 8px 30px ${currentTheme.shadow}`,
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px'
            }}>
              🚚
            </div>
            <h3 style={{ 
              color: currentTheme.text, 
              marginBottom: '15px',
              fontSize: '22px',
              fontWeight: '700'
            }}>
              Reliable Delivery
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary,
              fontSize: '16px',
              lineHeight: '1.6',
              margin: 0
            }}>
              Fast and secure delivery of your aquaculture products with real-time tracking and customer support.
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Landing;
