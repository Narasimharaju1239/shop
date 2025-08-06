const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (req, res) => {
  const { email, phone, method } = req.body;
  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const otp = generateOTP();
    const key = method === 'email' ? email : phone;
    
    // Store OTP with 10 minutes expiry
    otpStore.set(key, { otp, expires: Date.now() + 10 * 60 * 1000 });

    if (method === 'email') {
      // Send OTP via email
      const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sri Santhoshimatha Aqua Bazar - OTP Verification</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f0f2f5; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background-color: #2563eb; color: #ffffff; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🐟 Sri Santhoshimatha Aqua Bazar</h1>
                <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">OTP Verification</p>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <div style="text-align: center;">
                  <h2 style="color: #1f2937; font-size: 22px; margin: 0 0 20px; font-weight: bold;">Verify Your Account</h2>
                  <p style="font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.5;">
                    Welcome! Please use the verification code below to complete your registration:
                  </p>
                  
                  <!-- OTP Box - Simple and Clear -->
                  <div style="background-color: #ffffff; border: 3px solid #2563eb; border-radius: 8px; padding: 25px; margin: 30px 0; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);">
                    <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Your OTP Code</p>
                    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 6px; font-family: 'Courier New', monospace; background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 2px dashed #cbd5e1;">${otp}</div>
                  </div>
                  
                  <!-- Warning -->
                  <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 25px 0; text-align: left;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      ⚠️ <strong>Important:</strong> This code expires in 10 minutes. Keep it confidential.
                    </p>
                  </div>
                  
                  <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
                    If you didn't request this code, please ignore this email.
                  </p>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 13px; color: #6b7280;">
                  © 2025 Sri Santhoshimatha Aqua Bazar. All rights reserved.
                </p>
                <p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af;">
                  This is an automated message, please do not reply.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
      
      await sendEmail(email, 'Account Verification - OTP Code', htmlContent);
      res.json({ message: 'OTP sent to email successfully' });
    } else {
      // Send OTP via SMS
      const smsMessage = `🔐 Sri Santhoshimatha Aqua Bazar Verification

Your OTP code is: ${otp}

This code will expire in 10 minutes.
Do not share this code with anyone.

Thank you for choosing us!`;

      const smsResult = await sendSMS(phone, smsMessage);
      
      if (smsResult.success) {
        res.json({ message: 'OTP sent to phone successfully' });
      } else {
        // Remove OTP from store if SMS failed
        otpStore.delete(key);
        console.error('SMS sending failed:', smsResult.error);
        return res.status(400).json({ 
          message: `SMS delivery failed: ${smsResult.error}. Please try email verification instead.` 
        });
      }
    }
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Internal server error. Please try again.' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, phone, otp, method } = req.body;
  try {
    const key = method === 'email' ? email : phone;
    const storedOTP = otpStore.get(key);
    
    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }
    
    if (Date.now() > storedOTP.expires) {
      otpStore.delete(key);
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // OTP verified successfully
    otpStore.delete(key);
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

exports.signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, phone, role: 'customer' });
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ 
      token, 
      _id: user._id,
      name: user.name, 
      email: user.email, 
      role: user.role 
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not registered' });

    const token = generateToken(user._id);
    // Use frontend URL for reset link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/reset-password/${token}`;
    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset=\"UTF-8\" />
    <title>Sri Santhoshimatha Aqua Bazar</title>
  </head>
  <body style=\"margin: 0; padding: 0; background-color: #e0f2f1; font-family: Arial, sans-serif;\">
    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #e0f2f1; padding: 20px 0;\">
      <tr>
        <td align=\"center\">
          <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background: #ffffff; border-radius: 8px; overflow: hidden;\">
            <tr>
              <td style=\"background-color: #00695c; color: #ffffff; padding: 20px; text-align: center;\">
                <h1 style=\"margin: 0; font-size: 24px;\">Sri Santhoshimatha Aqua Bazar</h1>
                <p style=\"margin: 5px 0 0; font-size: 14px;\">Your trusted aqua feed and fish medicine partner</p>
              </td>
            </tr>
            <tr>
              <td style=\"padding: 30px 20px;\">
                <h2 style=\"color: #00695c; font-size: 20px; margin-top: 0;\">Password Reset Request</h2>
                <p style=\"font-size: 16px; color: #333333;\">
                  We received a request to reset your password. Click the button below to set a new password:
                </p>
                <div style=\"margin-top: 30px; text-align: center;\">
                  <a href=\"${link}\" style=\"
                    background-color: #00897b;
                    color: #ffffff;
                    padding: 12px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-size: 16px;
                    display: inline-block;\">Reset Password</a>
                </div>
                <p style=\"font-size: 13px; color: #888; margin-top: 30px;\">If you did not request this, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style=\"background-color: #f0f4c3; padding: 20px; text-align: center; font-size: 13px; color: #555;\">
                This message was sent by Sri Santhoshimatha Aqua Bazar.  <br />Please do not reply to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    await sendEmail(email, 'Password Reset', htmlContent);
    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};
