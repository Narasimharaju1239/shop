import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ContactUs = () => (
  <>
    <Navbar />
    
    <style>
      {`
        /* Hide scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        /* Hide scrollbar for Firefox */
        html {
          scrollbar-width: none;
        }
        
        /* Hide scrollbar for IE and Edge */
        body {
          -ms-overflow-style: none;
        }
      `}
    </style>
    
    {/* Main Content */}
    <div style={{ 
      paddingTop: '96px',
      paddingBottom: '120px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            letterSpacing: '-2px'
          }}>
            Get In Touch
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Contact Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '30px'
            }}>
              Send us a Message
            </h3>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input
                  type="text"
                  placeholder="First Name"
                  style={{
                    padding: '16px 20px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  style={{
                    padding: '16px 20px',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.9)',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                style={{
                  padding: '16px 20px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                style={{
                  padding: '16px 20px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
              />
              <textarea
                placeholder="Your Message"
                rows="6"
                style={{
                  padding: '16px 20px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.4)';
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '30px'
            }}>
              Contact Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📧
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>Email</h4>
                  <a href="mailto:info@shopeluru.com" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
                    info@shopeluru.com
                  </a>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📞
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>Phone</h4>
                  <a href="tel:+91-8812345678" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
                    +91-8812345678
                  </a>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📍
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>Address</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                    123 Main Street<br />
                    Eluru, Andhra Pradesh<br />
                    India - 534001
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🕒
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>Business Hours</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                    Monday - Saturday: 9:00 AM - 8:00 PM<br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div style={{ marginTop: '40px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                Follow Us
              </h4>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="https://www.facebook.com/shopeluru" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  📘
                </a>
                <a href="https://www.twitter.com/shopeluru" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  🐦
                </a>
                <a href="https://www.instagram.com/shopeluru" target="_blank" rel="noopener noreferrer" style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  📷
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </>
);

export default ContactUs;
