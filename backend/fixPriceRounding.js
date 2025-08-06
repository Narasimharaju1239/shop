const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const Order = require('./models/Order');

async function fixPriceRounding() {
  try {
    console.log('\n=== Fixing Price Rounding Issues ===\n');
    
    const orders = await Order.find();
    
    for (let order of orders) {
      let updated = false;
      let totalPrice = 0;
      
      const fixedItems = order.items.map(item => {
        const originalPrice = item.price;
        const roundedPrice = Math.round(originalPrice * 100) / 100; // Round to 2 decimal places
        
        if (originalPrice !== roundedPrice) {
          updated = true;
          console.log(`Fixing price: ${originalPrice} → ${roundedPrice} for ${item.name}`);
        }
        
        totalPrice += roundedPrice * item.quantity;
        
        return {
          ...item.toObject(),
          price: roundedPrice
        };
      });
      
      const roundedTotalPrice = Math.round(totalPrice * 100) / 100;
      
      if (updated || order.totalPrice !== roundedTotalPrice) {
        order.items = fixedItems;
        order.totalPrice = roundedTotalPrice;
        await order.save();
        console.log(`✓ Updated order ${order._id} - New total: ₹${roundedTotalPrice}`);
      }
    }
    
    console.log('\n✅ Price rounding fix completed!');
    
  } catch (error) {
    console.error('Error fixing price rounding:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixPriceRounding();
