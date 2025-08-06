// Debug script to check user roles and email addresses
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// Connect to database using environment variable
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aquabazar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkUsersAndRoles = async () => {
  try {
    console.log('=== DATABASE CONNECTION ===');
    console.log('Connecting to:', process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aquabazar');
    
    // Wait for connection
    await mongoose.connection.once('open', () => {
      console.log('✅ Connected to MongoDB');
    });
    
    console.log('\n=== USER ROLE DEBUGGING ===');
    
    // Get all users
    const allUsers = await User.find({}, 'name email role');
    console.log('All users in database:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    console.log('\n=== OWNER USERS ===');
    // Get only owner users
    const ownerUsers = await User.find({ role: 'owner' }, 'name email role');
    console.log(`Found ${ownerUsers.length} owner user(s):`);
    ownerUsers.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    console.log('\n=== CUSTOMER USERS ===');
    // Get only customer users
    const customerUsers = await User.find({ role: { $ne: 'owner' } }, 'name email role');
    console.log(`Found ${customerUsers.length} customer user(s):`);
    customerUsers.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}, Email: ${user.email}, Role: ${user.role || 'customer'}`);
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total users: ${allUsers.length}`);
    console.log(`Owner users: ${ownerUsers.length}`);
    console.log(`Customer users: ${customerUsers.length}`);
    
    console.log('\nDebugging complete!');
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkUsersAndRoles();
