const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
