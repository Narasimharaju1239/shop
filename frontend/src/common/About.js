import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => (
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            color: 'white',
            marginBottom: '30px',
            letterSpacing: '-3px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            About Sri Santhoshimatha Aqua Bazar
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontWeight: '400'
          }}>
            Your premier destination for prawns feed, prawns medicine, and fish medicine. Proud authorized dealer of Devi Sea Foods since 2017, serving Eluru's aquaculture community with excellence.
          </p>
        </div>

        {/* Main Content Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          
          {/* Our Story Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '50px 40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
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
              fontSize: '32px',
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
            }}>
              🦐
            </div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#333',
              marginBottom: '25px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Story
            </h3>
            <p style={{
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.8',
              margin: 0
            }}>
              Since 2017, Sri Santhoshimatha Aqua Bazar has been the authorized dealer of Devi Sea Foods in Eluru, specializing exclusively in prawns feed, prawns medicine, and fish medicine. We've built our reputation on delivering premium quality products that ensure healthy prawn cultivation and optimal yields for our valued customers.
            </p>
          </div>

          {/* Our Mission Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '50px 40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.boxShadow = '0 35px 70px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
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
              fontSize: '32px',
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
            }}>
              �
            </div>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#333',
              marginBottom: '25px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Mission
            </h3>
            <p style={{
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.8',
              margin: 0
            }}>
              As the trusted Devi Sea Foods dealer since 2017, our mission is to provide the finest prawns feed, prawns medicine, and fish medicine to support successful aquaculture operations. We are committed to helping prawn farmers achieve maximum growth, health, and profitability through our specialized product range and expert guidance.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '60px 50px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          marginBottom: '60px'
        }}>
          <h3 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '50px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Why Choose Sri Santhoshimatha Aqua Bazar?
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 20px auto',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                🦐
              </div>
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#333',
                marginBottom: '15px'
              }}>
                Prawns Feed Specialist
              </h4>
              <p style={{
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                Premium quality prawn feeds from Devi Sea Foods for optimal growth and health
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 20px auto',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                💊
              </div>
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#333',
                marginBottom: '15px'
              }}>
                Prawns & Fish Medicine
              </h4>
              <p style={{
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                Complete range of medicines for disease prevention and treatment
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 20px auto',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                🏅
              </div>
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#333',
                marginBottom: '15px'
              }}>
                Authorized Dealer Since 2017
              </h4>
              <p style={{
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                Official Devi Sea Foods dealer with 7+ years of trusted service
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 20px auto',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}>
                🎯
              </div>
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#333',
                marginBottom: '15px'
              }}>
                Expert Guidance
              </h4>
              <p style={{
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.6',
                margin: 0
              }}>
                Professional advice for successful prawn cultivation and farming
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '50px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ready to Start Your Prawn Farming Journey?
          </h3>
          <p style={{
            color: '#666',
            fontSize: '18px',
            lineHeight: '1.7',
            marginBottom: '35px',
            maxWidth: '700px',
            margin: '0 auto 35px auto'
          }}>
            Join hundreds of successful prawn farmers who trust Sri Santhoshimatha Aqua Bazar for their feed and medicine needs. As your authorized Devi Sea Foods dealer since 2017, we're here to support your aquaculture success.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/contactus"
              style={{
                display: 'inline-block',
                padding: '16px 35px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 45px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.4)';
              }}
            >
              Contact Us Today
            </a>
            
            <a 
              href="tel:+91-8812345678"
              style={{
                display: 'inline-block',
                padding: '16px 35px',
                background: 'transparent',
                color: '#667eea',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                border: '2px solid #667eea',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#667eea';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </>
);

export default About;
