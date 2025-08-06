require('dotenv').config();
const mongoose = require('mongoose');


const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('mongodb://127.0.0.1:27017/aquabazar');
  }
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const bcrypt = require('bcryptjs');
  const User = require('./models/User');

  // Remove any existing owner with the same email
  await User.deleteMany({ email: 'narasimharaju1239@gmail.com' });
  const password = await bcrypt.hash('N123456', 10);
  const owner = new User({
    name: 'Narasimha Raju',
    email: 'narasimharaju1239@gmail.com',
    password,
    phone: '8819859999',
    role: 'owner'
  });
  await owner.save();
  console.log('Owner seeded:', owner.email);
  // Show all owners in users collection
  const owners = await User.find({ role: 'owner' });
  console.log('All owners:', owners.map(u => ({ name: u.name, email: u.email, phone: u.phone })));
  mongoose.disconnect();
};

run().catch(err => console.error('Error:', err));
