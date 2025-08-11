const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// TextLocal SMS implementation (Indian service)
const sendSMSTextLocal = async (phoneNumber, message) => {
  try {
    const apiKey = process.env.TEXTLOCAL_API_KEY;
    const sender = process.env.TEXTLOCAL_SENDER || 'TXTLCL';
    
    // Format phone number - remove any non-digits and ensure it's 10 digits
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('91')) {
      formattedPhone = formattedPhone.substring(2);
    }
    if (formattedPhone.startsWith('+91')) {
      formattedPhone = formattedPhone.substring(3);
    }
    
    const data = new URLSearchParams({
      apikey: apiKey,
      numbers: formattedPhone,
      message: message,
      sender: sender
    });

    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      console.log(`✅ SMS sent via TextLocal to ${formattedPhone}`);
      return { success: true, provider: 'textlocal', response: result };
    } else {
      throw new Error(result.errors?.[0]?.message || 'TextLocal SMS failed');
    }
  } catch (error) {
    console.error('❌ TextLocal SMS failed:', error.message);
    return { success: false, error: error.message };
  }
};

// MSG91 SMS implementation
const sendSMSMSG91 = async (phoneNumber, messageType = 'order', otp = null) => {
  const axios = require('axios');
  const MSG91_API_KEY = process.env.MSG91_API_KEY || 'YOUR_MSG91_API_KEY';
  const SENDER_ID = process.env.MSG91_SENDER_ID || 'aquabz';
  const TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

  // Format phone number - ensure it's 10 digits
  let formattedPhone = phoneNumber.replace(/\D/g, '');
  if (formattedPhone.startsWith('91')) {
    formattedPhone = formattedPhone.substring(2);
  }
  if (formattedPhone.startsWith('+91')) {
    formattedPhone = formattedPhone.substring(3);
  }

  let message = '';
  let templateId = undefined;
  let variables = undefined;

  if (messageType === 'order') {
    message = 'Order placed successfully! Thanks for logging into Sri Santhoshimatha Aqua Bazar.';
  } else if (messageType === 'signup' && otp) {
    // Use DLT template for OTP
    message = undefined; // MSG91 will use template
    templateId = TEMPLATE_ID;
  variables = { otp: otp };
  } else {
    message = 'Sri Santhoshimatha Aqua Bazar notification.';
  }

  const url = 'https://api.msg91.com/api/v2/sendsms';
  const smsPayload = {
    sender: SENDER_ID,
    route: '4',
    country: '91',
    sms: [
      {
        to: [formattedPhone]
      }
    ]
  };

  if (templateId && variables) {
    smsPayload.sms[0].template_id = templateId;
    smsPayload.sms[0].variables = variables;
    smsPayload.sms[0].message = 'OTP'; // Dummy message for MSG91 template API
  } else if (message) {
    smsPayload.sms[0].message = message;
  }

  const headers = {
    'authkey': MSG91_API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    console.log('MSG91 SMS Payload:', JSON.stringify(smsPayload, null, 2));
    const response = await axios.post(url, smsPayload, { headers });
    console.log('MSG91 API Full Response:', JSON.stringify(response.data, null, 2));
    if (response.data && response.data.type === 'success') {
      console.log(`✅ SMS sent via MSG91 to ${formattedPhone}`);
      return { success: true, provider: 'msg91', response: response.data };
    } else {
      console.error('MSG91 API Error:', response.data);
      throw new Error(response.data.message || 'MSG91 SMS failed');
    }
  } catch (error) {
    console.error('MSG91 SMS error:', error);
    if (error.response) {
      console.error('MSG91 error response:', error.response.data);
    }
    throw error;
  }
};

// 2Factor SMS implementation (Popular Indian OTP service)
const sendSMS2Factor = async (phoneNumber, otp) => {
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    
    // Format phone number
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhone}/${otp}`;

    const response = await fetch(url, { method: 'GET' });
    const result = await response.json();
    
    if (result.Status === 'Success') {
      console.log(`✅ OTP SMS sent via 2Factor to ${formattedPhone}`);
      return { success: true, provider: '2factor', response: result };
    } else {
      throw new Error(result.Details || '2Factor SMS failed');
    }
  } catch (error) {
    console.error('❌ 2Factor SMS failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Fast2SMS implementation (Indian service with free tier)
const sendSMSFast2SMS = async (phoneNumber, message) => {
  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        sender_id: 'FSTSMS',
        message: message,
        language: 'english',
        flash: 0,
        numbers: phoneNumber.replace(/^\+?91/, '') // Remove +91 prefix
      })
    });

    const result = await response.json();
    
    if (result.return === true) {
      console.log(`SMS sent via Fast2SMS to ${phoneNumber}`);
      return { success: true, provider: 'fast2sms', response: result };
    } else {
      throw new Error(result.message || 'Fast2SMS failed');
    }
  } catch (error) {
    console.error('Fast2SMS failed:', error);
    return { success: false, error: error.message };
  }
};

// Local simulation for development
const sendSMSLocal = async (phoneNumber, message) => {
  try {
    // For development/testing - just log the SMS
    console.log('\n📱 === SMS SENT (LOCAL SIMULATION) ===');
    console.log(`📞 To: ${phoneNumber}`);
    console.log(`💬 Message: ${message}`);
    console.log('=====================================\n');
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, provider: 'local-simulation' };
  } catch (error) {
    console.error('Local SMS simulation failed:', error);
    return { success: false, error: error.message };
  }
};

// Twilio implementation (requires paid account)
const sendSMSTwilio = async (phoneNumber, message) => {
  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Format phone number
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    const messageResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`SMS sent via Twilio to ${formattedPhone}, SID: ${messageResponse.sid}`);
    return { success: true, provider: 'twilio', sid: messageResponse.sid };
  } catch (error) {
    console.error('Twilio SMS failed:', error);
    return { success: false, error: error.message };
  }
};

const sendSMS = async (phoneNumber, message) => {
  // Extract OTP from message for services that need it separately
  const otpMatch = message.match(/Your OTP code is: (\d+)/);
  const otp = otpMatch ? otpMatch[1] : null;
  
  // Choose SMS provider based on environment variables
  const smsProvider = process.env.SMS_PROVIDER || 'msg91';
  
  console.log(`🚀 Sending SMS via ${smsProvider} provider to ${phoneNumber}`);
  
  try {
    let result;
    
    switch (smsProvider) {
      case 'textlocal':
        if (process.env.TEXTLOCAL_API_KEY) {
          result = await sendSMSTextLocal(phoneNumber, message);
        } else {
          console.warn('⚠️ TextLocal API key not found, falling back to local simulation');
          result = await sendSMSLocal(phoneNumber, message);
        }
        break;
      
      case 'msg91':
        if (process.env.MSG91_API_KEY) {
          if (otp) {
            result = await sendSMSMSG91(phoneNumber, 'signup', otp);
          } else {
            result = await sendSMSMSG91(phoneNumber, 'order');
          }
        } else {
          console.warn('⚠️ MSG91 API key not found, falling back to local simulation');
          result = await sendSMSLocal(phoneNumber, message);
        }
        break;
      
      case '2factor':
        if (process.env.TWOFACTOR_API_KEY && otp) {
          result = await sendSMS2Factor(phoneNumber, otp);
        } else {
          console.warn('⚠️ 2Factor API key not found or no OTP extracted, falling back to local simulation');
          result = await sendSMSLocal(phoneNumber, message);
        }
        break;
      
      case 'fast2sms':
        if (process.env.FAST2SMS_API_KEY) {
          result = await sendSMSFast2SMS(phoneNumber, message);
        } else {
          console.warn('⚠️ Fast2SMS API key not found, falling back to local simulation');
          result = await sendSMSLocal(phoneNumber, message);
        }
        break;
      
      case 'twilio':
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
          result = await sendSMSTwilio(phoneNumber, message);
        } else {
          console.warn('⚠️ Twilio credentials not found, falling back to local simulation');
          result = await sendSMSLocal(phoneNumber, message);
        }
        break;
      
      case 'local':
      default:
        result = await sendSMSLocal(phoneNumber, message);
        break;
    }
    
    return result;
  } catch (error) {
    console.error(`❌ SMS sending failed with ${smsProvider}:`, error);
    // Fallback to local simulation if all fails
    console.log('📱 Falling back to local simulation...');
    return await sendSMSLocal(phoneNumber, message);
  }
};

// MSG91 SMS implementation (alternative version)
const sendSMSMSG91Alt = async (phoneNumber, message) => {
  const axios = require('axios');
  const MSG91_API_KEY = process.env.MSG91_API_KEY || 'YOUR_MSG91_API_KEY'; // Set in .env
  const SENDER_ID = 'aquabz'; // Use your approved sender ID

  // Format phone number - ensure it's 10 digits
  let formattedPhone = phoneNumber.replace(/\D/g, '');
  if (formattedPhone.startsWith('91')) {
    formattedPhone = formattedPhone.substring(2);
  }
  if (formattedPhone.startsWith('+91')) {
    formattedPhone = formattedPhone.substring(3);
  }

  const url = 'https://api.msg91.com/api/v2/sendsms';
  const payload = {
    sender: SENDER_ID,
    route: '4', // '4' for transactional, '1' for promotional
    country: '91',
    sms: [
      {
        message,
        to: [formattedPhone]
      }
    ]
  };

  const headers = {
    'authkey': MSG91_API_KEY,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(url, payload, { headers });
    if (response.data && response.data.type === 'success') {
      console.log(`✅ SMS sent via MSG91 to ${formattedPhone}`);
      return { success: true, provider: 'msg91', response: response.data };
    } else {
      throw new Error(response.data.message || 'MSG91 SMS failed');
    }
  } catch (error) {
    console.error('MSG91 SMS error:', error);
    throw error;
  }
};

module.exports = { sendSMSTextLocal, sendSMSMSG91, sendSMS };
