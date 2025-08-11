// Usage: node scripts/seedCompany.js
const mongoose = require('mongoose');
const Company = require('../models/Company');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shop';

const companyData = {
  _id: '6893365158fb5481ac32fbc4',
  name: 'Default Company',
  image: '/uploads/default-company.png'
};

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    try {
      const existing = await Company.findById(companyData._id);
      if (existing) {
        console.log('Company already exists:', existing);
      } else {
        const company = await Company.create(companyData);
        console.log('Company seeded:', company);
      }
    } catch (err) {
      console.error('Error seeding company:', err);
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
