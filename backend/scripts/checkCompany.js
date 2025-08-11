// Usage: node scripts/checkCompany.js <companyId>
const mongoose = require('mongoose');
const Company = require('../models/Company');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shop';
const companyId = process.argv[2];

if (!companyId || companyId.length !== 24) {
  console.error('Please provide a valid 24-character companyId as argument.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const company = await Company.findById(companyId);
    if (company) {
      console.log('Company found:', company);
    } else {
      console.log('Company not found for ID:', companyId);
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
