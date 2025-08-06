const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Enhanced logging for debugging email targeting issues
    console.log('=== EMAIL DEBUG START ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Recipients:', Array.isArray(to) ? to : [to]);
    console.log('Subject:', subject);
    
    // Detect email type based on subject for better tracking
    if (subject.includes('New Order')) {
      console.log('📦 EMAIL TYPE: OWNER NOTIFICATION (New order received)');
    } else if (subject.includes('Status Update')) {
      console.log('📬 EMAIL TYPE: CUSTOMER NOTIFICATION (Order status update)');
    } else {
      console.log('📧 EMAIL TYPE: GENERAL EMAIL');
    }
    
    // Validation
    if (!to) {
      console.error('❌ Email validation failed: No recipients specified');
      return;
    }
    if (!subject) {
      console.error('❌ Email validation failed: No subject specified');
      return;
    }
    if (!htmlContent) {
      console.error('❌ Email validation failed: No content specified');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Sri Santhoshimatha Aqua Bazar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email successfully sent to:', mailOptions.to);
    console.log('=== EMAIL DEBUG END ===\n');
    
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('Error:', error.message);
    console.error('Recipients:', to);
    console.error('Subject:', subject);
    console.error('=== EMAIL ERROR END ===\n');
  }
};

module.exports = sendEmail;
