// Usage: node scripts/findInvalidProductCompanies.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Company = require('../models/Company');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shop';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const companies = await Company.find({}, '_id');
    const validIds = companies.map(c => c._id.toString());
    const products = await Product.find({ companyId: { $exists: true, $ne: null } });
    const invalidProducts = products.filter(p => !validIds.includes(p.companyId?.toString()));
    if (invalidProducts.length === 0) {
      console.log('All products have valid companyId.');
    } else {
      console.log('Products with invalid companyId:');
      invalidProducts.forEach(p => {
        console.log({ _id: p._id, name: p.name, companyId: p.companyId });
      });
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
