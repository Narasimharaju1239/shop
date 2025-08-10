// sendEmail.js - Send email using nodemailer and SMTP
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    // Replace these with your SMTP provider's credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // For Gmail, but use SendGrid/Mailgun/SES for production
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Beautiful responsive email CSS
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
        <h2 style="color: #1976d2; text-align: center; margin-bottom: 24px;">Sri Santhoshimatha Aqua Bazar</h2>
        <div style="background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          ${html}
        </div>
        <div style="text-align: center; color: #888; font-size: 13px; margin-top: 24px;">
          &copy; ${new Date().getFullYear()} Sri Santhoshimatha Aqua Bazar. All rights reserved.
        </div>
      </div>
    `;

    const mailOptions = {
      from: 'Sri Santhoshimatha Aqua Bazar <ssmab12399@gmail.com>',
      to,
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', to);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

module.exports = sendEmail;
