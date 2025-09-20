const mongoose = require('mongoose');

const GuestCartSchema = new mongoose.Schema({
  guestId: { type: String, required: true, unique: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, default: 1 }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GuestCart', GuestCartSchema);
