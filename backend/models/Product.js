const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  offer: { type: Number, default: 0 },
  image: { type: String },
  description: { type: String },
  details: { type: String }, // New field for product details
  gst: { type: Number, default: 0 }, // GST percentage
  hsnCode: { type: String }, // HSN code
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
