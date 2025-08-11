const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['customer', 'owner'], default: 'customer' },
  image: { type: String }
}, { timestamps: true, collection: 'users' });

module.exports = mongoose.model('User', userSchema);

