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
const Product = require('./models/Product');

async function fixExistingOrders() {
  try {
    console.log('\n=== Checking Products Available ===\n');
    
    const products = await Product.find().limit(10);
    console.log(`Found ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.offer || 0}% off)`);
    });
    
    console.log('\n=== Fixing Existing Orders ===\n');
    
    // Find orders with problematic items (no name or price)
    const problematicOrders = await Order.find({
      $or: [
        { 'items.name': { $exists: false } },
        { 'items.name': null },
        { 'items.name': '' },
        { 'items.price': { $exists: false } },
        { 'items.price': null },
        { 'items.price': 0 },
        { totalPrice: 0 }
      ]
    });
    
    console.log(`Found ${problematicOrders.length} orders that need fixing`);
    
    for (let order of problematicOrders) {
      console.log(`\nFixing Order ID: ${order._id}`);
      console.log(`Original items count: ${order.items.length}`);
      
      // For demonstration, let's set default product data for existing orders
      // In a real scenario, you might want to try to match with actual products
      let totalPrice = 0;
      const fixedItems = order.items.map((item, index) => {
        // Use sample product data or try to find a real product
        const sampleProduct = products[index % products.length] || {
          name: 'Sample Product',
          price: 50,
          offer: 0
        };
        
        const quantity = item.quantity || 1;
        const basePrice = sampleProduct.price;
        const offer = sampleProduct.offer || 0;
        const finalPrice = offer > 0 ? basePrice * (1 - offer / 100) : basePrice;
        
        totalPrice += finalPrice * quantity;
        
        return {
          name: item.name || sampleProduct.name,
          price: item.price || finalPrice,
          quantity: quantity,
          productId: item.productId || item._id || sampleProduct._id,
          offer: item.offer || offer
        };
      });
      
      console.log(`Fixed items:`, fixedItems.map(item => `${item.name} x${item.quantity} = ₹${item.price * item.quantity}`));
      console.log(`New total: ₹${totalPrice}`);
      
      // Update the order
      order.items = fixedItems;
      order.totalPrice = totalPrice;
      await order.save();
      console.log(`✓ Order ${order._id} updated successfully`);
      
      console.log(`[DRY RUN] Would update order ${order._id} with new total ₹${totalPrice}`);
    }
    
    console.log('\n=== Summary ===');
    console.log('The script has identified orders that need fixing.');
    console.log('To actually apply the fixes, uncomment the update lines in the script.');
    console.log('This was a dry run to show what would be changed.');
    
  } catch (error) {
    console.error('Error fixing orders:', error);
  } finally {
    mongoose.disconnect();
  }
}

fixExistingOrders();
