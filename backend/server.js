require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cartRoutes = require('./routes/cartRoutes');
const guestCartRoutes = require('./routes/guestCartRoutes');
// Removed paymentRoutes import (file deleted)
const payuRoutes = require('./routes/payuRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

require('./utils/cloudinary'); // Force Cloudinary config and debug log
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://6899ee6ae42fb400080d45aa--srisanthoshimathaaquabazar.netlify.app',
    'https://srisanthoshimathaaquabazar.netlify.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/guest-cart', guestCartRoutes);
// Removed paymentRoutes usage (file deleted)
app.use('/api/payu', payuRoutes);

app.get('/', (req, res) => {
  res.send('Sri Santhoshimatha Aqua Bazar API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
