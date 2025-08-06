const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    productId: mongoose.Schema.Types.ObjectId,
    offer: { type: Number, default: 0 }
  }],
  shipping: {
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    phone: String,
    alternativePhone: String,
    name: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  totalPrice: { type: Number },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
