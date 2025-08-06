import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import API from '../utils/api';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  // Hide scrollbars but allow scrolling
  React.useEffect(() => {
    // Hide scrollbar but allow scrolling
    document.documentElement.style.scrollbarWidth = 'none'; // Firefox
    document.documentElement.style.msOverflowStyle = 'none'; // IE/Edge
    
    // Add CSS to hide scrollbar for webkit browsers
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        display: none;
      }
      body {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.documentElement.style.scrollbarWidth = '';
      document.documentElement.style.msOverflowStyle = '';
      document.head.removeChild(style);
    };
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) {
      alert('Please fill all fields first');
      return;
    }
    
    setIsLoading(true);
    try {
      await API.post('/auth/send-otp', {
        email: form.email,
        phone: form.phone,
        method: verificationMethod
      });
      setOtpStep(true);
      alert(`OTP sent to your ${verificationMethod === 'email' ? 'email' : 'phone number'} successfully!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      // First verify OTP
      await API.post('/auth/verify-otp', {
        email: form.email,
        phone: form.phone,
        otp,
        method: verificationMethod
      });
      
      // If OTP is verified, proceed with signup
      await API.post('/auth/signup', form);
      alert('Account created successfully!');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      await API.post('/auth/send-otp', {
        email: form.email,
        phone: form.phone,
        method: verificationMethod
      });
      alert(`OTP resent to your ${verificationMethod === 'email' ? 'email' : 'phone number'}!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend OTP';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: currentTheme.background,
      color: currentTheme.text
    }}>
      <Navbar />
      
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Changed from center to flex-start
        padding: '15px', // Reduced padding
        paddingTop: '20px', // Add top padding
        paddingBottom: '20px', // Add bottom padding
        overflow: 'auto' // Allow scrolling if needed
      }}>
        <div style={{
          background: currentTheme.card,
          padding: '25px', // Reduced padding
          borderRadius: '8px',
          boxShadow: `0 4px 6px ${currentTheme.shadow}`,
          width: '100%',
          maxWidth: '400px', // Reduced max width
          border: `1px solid ${currentTheme.border}`,
          margin: 'auto' // Center horizontally
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '20px', // Reduced margin
            color: currentTheme.text,
            fontSize: '22px', // Slightly smaller
            fontWeight: '600'
          }}>
            {otpStep ? 'Verify OTP' : 'Create Account'}
          </h2>

          <form onSubmit={otpStep ? handleVerifyAndSignup : handleSendOTP}>
            {!otpStep ? (
              <>
                <div style={{ marginBottom: '15px' }}> {/* Reduced margin */}
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px', // Reduced padding
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: currentTheme.input,
                      color: currentTheme.text,
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: currentTheme.input,
                      color: currentTheme.text,
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Password" 
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: currentTheme.input,
                      color: currentTheme.text,
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <input 
                    type="text" 
                    placeholder="Phone Number" 
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      fontSize: '16px',
                      background: currentTheme.input,
                      color: currentTheme.text,
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px' 
                }}>
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    style={{ marginRight: '8px' }}
                  />
                  <label 
                    htmlFor="showPassword" 
                    style={{ 
                      fontSize: '14px', 
                      color: currentTheme.textSecondary, 
                      cursor: 'pointer' 
                    }}
                  >
                    Show Password
                  </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    color: currentTheme.text, 
                    marginBottom: '8px', // Reduced margin
                    fontWeight: '500'
                  }}>
                    Verification method:
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}> {/* Reduced gap */}
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: currentTheme.text
                    }}>
                      <input
                        type="radio"
                        value="email"
                        checked={verificationMethod === 'email'}
                        onChange={(e) => setVerificationMethod(e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Email
                    </label>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: currentTheme.text
                    }}>
                      <input
                        type="radio"
                        value="phone"
                        checked={verificationMethod === 'phone'}
                        onChange={(e) => setVerificationMethod(e.target.value)}
                        style={{ marginRight: '6px' }}
                      />
                      Phone
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px', // Reduced padding
                    background: isLoading ? currentTheme.textSecondary : currentTheme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginBottom: '15px' // Reduced margin
                  }}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <div style={{ 
                  textAlign: 'center', 
                  padding: '15px', // Reduced padding
                  background: currentTheme.surface, 
                  borderRadius: '6px', 
                  marginBottom: '15px', // Reduced margin
                  border: `1px solid ${currentTheme.border}`
                }}>
                  <p style={{ margin: '0 0 8px', color: currentTheme.text, fontSize: '14px' }}>
                    Enter the 6-digit code sent to:
                  </p>
                  <p style={{ 
                    margin: '0', 
                    fontWeight: '600', 
                    color: currentTheme.primary,
                    fontSize: '15px', // Reduced font size
                    wordBreak: 'break-word' // Better word breaking
                  }}>
                    {verificationMethod === 'email' ? form.email : form.phone}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    required
                    value={otp}
                    maxLength="6"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ 
                      width: '100%', 
                      padding: '12px', // Slightly reduced
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px', 
                      fontSize: '16px', // Reduced font size
                      textAlign: 'center',
                      letterSpacing: '1px', // Reduced letter spacing
                      background: currentTheme.input,
                      color: currentTheme.text,
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: isLoading ? currentTheme.textSecondary : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginBottom: '15px'
                  }}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                </button>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '13px' // Reduced font size
                }}>
                  <button 
                    type="button" 
                    onClick={resendOTP}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: currentTheme.primary,
                      textDecoration: 'underline',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Resend OTP
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setOtpStep(false); setOtp(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: currentTheme.textSecondary,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Back to Form
                  </button>
                </div>
              </>
            )}

            <div style={{
              textAlign: 'center',
              marginTop: '15px', // Reduced margin
              fontSize: '14px',
              color: currentTheme.textSecondary
            }}>
              Already have an account?{' '}
              <a 
                href="/login" 
                style={{ 
                  color: currentTheme.primary, 
                  textDecoration: 'none'
                }}
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
      
      {/* Add responsive CSS */}
      <style>
        {`
          @media (max-width: 480px) {
            .signup-container {
              padding: 10px !important;
              margin: 5px !important;
            }
            .signup-form {
              padding: 20px !important;
              max-width: 350px !important;
            }
          }
          
          @media (max-height: 700px) {
            .signup-container {
              align-items: flex-start !important;
              padding-top: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
