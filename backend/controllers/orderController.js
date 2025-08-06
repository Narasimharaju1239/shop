const Order = require('../models/Order');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.placeOrder = async (req, res, next) => {
  try {
    const { items, shipping } = req.body;
    
    // Validate items and calculate totalPrice properly
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required and must be a non-empty array' });
    }
    
    // Transform cart items to order items format
    const orderItems = items.map(item => {
      // Handle both direct order format and cart format
      if (item.product) {
        // Cart item format: { product: {}, quantity: number }
        const product = item.product;
        const quantity = item.quantity || 1;
        const basePrice = parseFloat(product.price) || 0;
        const offer = parseFloat(product.offer) || 0;
        
        // Calculate final price with offer
        const finalPrice = offer > 0 ? Math.round(basePrice * (1 - offer / 100)) : basePrice;
        
        return {
          name: product.name || 'Product',
          price: finalPrice,
          quantity: quantity,
          productId: product._id,
          offer: offer
        };
      } else {
        // Direct order format: { name: string, price: number, quantity: number }
        return {
          name: item.name || 'Product',
          price: parseFloat(item.price) || 0,
          quantity: item.quantity || 1,
          productId: item.productId || item._id,
          offer: parseFloat(item.offer) || 0
        };
      }
    });
    
    // Calculate total price from transformed items
    const totalPrice = orderItems.reduce((sum, item) => {
      const itemTotal = (item.price * item.quantity);
      return sum + itemTotal;
    }, 0);
    
    // Validate that totalPrice is a valid number
    if (isNaN(totalPrice) || totalPrice < 0) {
      return res.status(400).json({ message: 'Invalid total price calculation' });
    }
    
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shipping,
      totalPrice
    });

    // Populate user details for email notification
    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');

    // Send email notification to all owner users about new order
    try {
      // Fetch all users with 'owner' role
      const ownerUsers = await User.find({ role: 'owner' }, 'name email');
      
      if (ownerUsers.length === 0) {
        console.log('No owner users found to notify');
      } else {
        const customerName = populatedOrder.user?.name || 'Customer';
        const customerEmail = populatedOrder.user?.email || 'N/A';
        const orderNumber = populatedOrder._id.toString().slice(-8).toUpperCase();
        const customerPhone = shipping?.phone || 'N/A';
        const customerAddress = shipping?.address || 'N/A';
        
        // Create items summary for email
        const itemsSummary = orderItems.map(item => {
          const itemTotal = item.price * item.quantity;
          return `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px; color: #333;">${item.name}</td>
              <td style="padding: 10px; text-align: center; color: #666;">₹${item.price.toLocaleString('en-IN')}</td>
              <td style="padding: 10px; text-align: center; color: #666;">${item.quantity}</td>
              <td style="padding: 10px; text-align: center; color: #333; font-weight: bold;">₹${Math.round(itemTotal).toLocaleString('en-IN')}</td>
            </tr>
          `;
        }).join('');

        // Send email to each owner user
        const emailPromises = ownerUsers.map(async (owner) => {
          const ownerName = owner.name || 'Owner';
          
          console.log(`📧 Sending NEW ORDER email to OWNER: ${owner.email} (${ownerName})`);
          console.log(`📦 Order from CUSTOMER: ${customerEmail} (${customerName})`);
          
          const ownerEmailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 New Order Received!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Sri Santhoshimatha Aqua Bazar</p>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${ownerName},</h2>
                <p style="color: #666; margin: 0 0 20px 0;">A new order has been placed on your website and requires your attention.</p>
                
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-bottom: 25px;">
                  <h3 style="color: #1976d2; margin: 0 0 15px 0;">📦 Order Details</h3>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Order Number:</span>
                    <span style="font-weight: bold; color: #333;">#${orderNumber}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Order Date:</span>
                    <span style="color: #333;">${new Date().toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Status:</span>
                    <span style="background: #FF9800; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">PENDING</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">Total Amount:</span>
                    <span style="font-weight: bold; color: #4caf50; font-size: 18px;">₹${Math.round(totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 25px;">
                  <h3 style="color: #28a745; margin: 0 0 15px 0;">👤 Customer Information</h3>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                      <strong style="color: #333;">Name:</strong><br>
                      <span style="color: #666;">${customerName}</span>
                    </div>
                    <div>
                      <strong style="color: #333;">Email:</strong><br>
                      <span style="color: #666;">${customerEmail}</span>
                    </div>
                    <div>
                      <strong style="color: #333;">Phone:</strong><br>
                      <span style="color: #666;">${customerPhone}</span>
                    </div>
                    <div>
                      <strong style="color: #333;">Payment:</strong><br>
                      <span style="color: #666;">${shipping?.paymentMethod || 'N/A'}</span>
                    </div>
                  </div>
                  <div style="margin-top: 15px;">
                    <strong style="color: #333;">Shipping Address:</strong><br>
                    <span style="color: #666; line-height: 1.5;">
                      ${customerAddress}<br>
                      ${shipping?.landmark ? `Landmark: ${shipping.landmark}<br>` : ''}
                      ${[shipping?.city, shipping?.state, shipping?.pincode].filter(Boolean).join(', ')}
                      ${shipping?.alternativePhone ? `<br>Alt. Phone: ${shipping.alternativePhone}` : ''}
                    </span>
                  </div>
                </div>

                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 25px;">
                  <h3 style="color: #f57c00; margin: 0 0 15px 0;">🛒 Order Items</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; color: #333; font-weight: 600;">Product</th>
                        <th style="padding: 12px; text-align: center; color: #333; font-weight: 600;">Price</th>
                        <th style="padding: 12px; text-align: center; color: #333; font-weight: 600;">Qty</th>
                        <th style="padding: 12px; text-align: center; color: #333; font-weight: 600;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsSummary}
                      <tr style="background: #f5f5f5; font-weight: bold;">
                        <td colspan="3" style="padding: 15px; text-align: right; color: #333; font-size: 16px;">Grand Total:</td>
                        <td style="padding: 15px; text-align: center; color: #4caf50; font-size: 18px; font-weight: bold;">₹${Math.round(totalPrice).toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #9c27b0; margin-bottom: 25px;">
                  <h3 style="color: #7b1fa2; margin: 0 0 10px 0;">📋 Action Required</h3>
                  <p style="color: #666; margin: 0; line-height: 1.5;">
                    This new order is waiting for confirmation. Please log in to your admin panel to:
                  </p>
                  <ul style="color: #666; margin: 10px 0 0 20px; line-height: 1.5;">
                    <li>Review and confirm the order</li>
                    <li>Update inventory if needed</li>
                    <li>Prepare for fulfillment</li>
                    <li>Update customer with shipping details</li>
                  </ul>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #666; margin: 0 0 15px 0;">Manage this order in your admin panel:</p>
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/owner/orders" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                    📦 Manage Orders
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Sri Santhoshimatha Aqua Bazar Admin System
                </p>
              </div>
            </div>
          `;

          return sendEmail(
            owner.email,
            `🎉 New Order #${orderNumber} - ₹${Math.round(totalPrice).toLocaleString('en-IN')} from ${customerName}`,
            ownerEmailContent
          );
        });

        // Send all emails concurrently
        await Promise.all(emailPromises);

        console.log(`Owner notification emails sent to ${ownerUsers.length} owner(s) for new order ${orderNumber} from ${customerName}`);
      }
    } catch (emailError) {
      console.error('Failed to send owner notification emails:', emailError);
      // Don't fail the order placement if email fails
    }

    // Send thank you email to customer
    try {
      const customerName = populatedOrder.user?.name || 'Valued Customer';
      const customerEmail = populatedOrder.user?.email;
      const orderNumber = populatedOrder._id.toString().slice(-8).toUpperCase();
      
      if (customerEmail) {
        console.log(`📧 Sending THANK YOU email to CUSTOMER: ${customerEmail} (${customerName})`);
        console.log(`📦 Order #${orderNumber} confirmation and thank you`);

        const customerThankYouContent = `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🙏 Thank You for Your Order!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Sri Santhoshimatha Aqua Bazar</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin: 0 0 20px 0;">Dear ${customerName},</h2>
              <p style="color: #666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                Thank you for choosing <strong>Sri Santhoshimatha Aqua Bazar</strong> for your aquaculture needs! 
                We are delighted to confirm that your order has been successfully placed and is now being processed with care.
              </p>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin-bottom: 25px;">
                <h3 style="color: #4caf50; margin: 0 0 15px 0;">✅ Order Confirmation</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Order Number:</span>
                  <span style="font-weight: bold; color: #333;">#${orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Order Date:</span>
                  <span style="color: #333;">${new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Status:</span>
                  <span style="background: #FF9800; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">PROCESSING</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Total Amount:</span>
                  <span style="font-weight: bold; color: #4caf50; font-size: 18px;">₹${Math.round(totalPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-bottom: 25px;">
                <h3 style="color: #2196f3; margin: 0 0 15px 0;">🚀 What Happens Next?</h3>
                <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li><strong>Order Processing:</strong> Our team will prepare your prawns feed and aquaculture products</li>
                  <li><strong>Quality Check:</strong> Each item will be carefully inspected for quality assurance</li>
                  <li><strong>Packaging:</strong> Your products will be securely packaged for safe delivery</li>
                  <li><strong>Shipping:</strong> We'll send you tracking details once your order is dispatched</li>
                </ul>
              </div>

              <div style="background: #fff8e1; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
                <h3 style="color: #f57c00; margin: 0 0 15px 0;">🐟 Why Choose Sri Santhoshimatha Aqua Bazar?</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; color: #666;">
                  <div>
                    <strong style="color: #333;">✨ Premium Quality</strong><br>
                    <span>High-grade prawns feed and medicines</span>
                  </div>
                  <div>
                    <strong style="color: #333;">🏆 Trusted Since 2017</strong><br>
                    <span>Authorized dealer of Devi Sea Foods</span>
                  </div>
                  <div>
                    <strong style="color: #333;">🚚 Fast Delivery</strong><br>
                    <span>Quick and reliable shipping</span>
                  </div>
                  <div>
                    <strong style="color: #333;">💯 Expert Support</strong><br>
                    <span>Professional aquaculture guidance</span>
                  </div>
                </div>
              </div>

              <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #9c27b0; margin-bottom: 25px;">
                <h3 style="color: #7b1fa2; margin: 0 0 10px 0;">📞 Need Assistance?</h3>
                <p style="color: #666; margin: 0 0 15px 0; line-height: 1.5;">
                  Our aquaculture experts are here to help you succeed in your fish and prawn farming journey.
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; color: #666;">
                  <div>
                    <strong style="color: #333;">📱 Phone Support:</strong><br>
                    <span style="color: #7b1fa2;">+91-XXXXXXXXXX</span>
                  </div>
                  <div>
                    <strong style="color: #333;">📧 Email Support:</strong><br>
                    <span style="color: #7b1fa2;">support@srisanthoshimatha.com</span>
                  </div>
                </div>
              </div>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">Thank you for trusting us with your aquaculture needs!</p>
                <p style="color: #999; margin: 0; font-style: italic;">
                  "Your success in aquaculture is our commitment" - Sri Santhoshimatha Team
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sri Santhoshimatha Aqua Bazar - Authorized Dealer of Devi Sea Foods since 2017
              </p>
            </div>
          </div>
        `;

        await sendEmail(
          customerEmail,
          `🙏 Thank You for Your Order #${orderNumber} - Sri Santhoshimatha Aqua Bazar`,
          customerThankYouContent
        );

        console.log(`✅ Thank you email sent to customer: ${customerEmail} for order ${orderNumber}`);
      } else {
        console.log('❌ No customer email found for thank you notification');
      }
    } catch (emailError) {
      console.error('Failed to send customer thank you email:', emailError);
      // Don't fail the order placement if email fails
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Error placing order:', err);
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, sendEmailNotification } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ') 
      });
    }
    
    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();
    await order.save();
    
    // Send email notification if requested and user has email
    if (sendEmailNotification && order.user && order.user.email) {
      try {
        const statusMessages = {
          'Confirmed': 'Your order has been confirmed and is being prepared.',
          'Processing': 'Your order is currently being processed.',
          'Shipped': 'Great news! Your order has been shipped and is on its way.',
          'Delivered': 'Your order has been successfully delivered. Thank you for shopping with us!',
          'Cancelled': 'Unfortunately, your order has been cancelled. Please contact us for more information.'
        };

        const customerName = order.user.name || 'Valued Customer';
        const orderNumber = order._id.toString().slice(-8).toUpperCase();
        const statusMessage = statusMessages[status] || `Your order status has been updated to ${status}.`;
        
        console.log(`📧 Sending STATUS UPDATE email to CUSTOMER: ${order.user.email} (${customerName})`);
        console.log(`📋 Order #${orderNumber} status changed to: ${status}`);

        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Sri Santhoshimatha Aqua Bazar</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Order Status Update</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${customerName},</h2>
              
              <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                <h3 style="color: #667eea; margin: 0 0 10px 0;">Order Update</h3>
                <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.5;">${statusMessage}</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #333; margin: 0 0 15px 0;">Order Details:</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Order Number:</span>
                  <span style="font-weight: bold; color: #333;">#${orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Status:</span>
                  <span style="font-weight: bold; color: #667eea; text-transform: uppercase;">${status}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Total Amount:</span>
                  <span style="font-weight: bold; color: #333;">₹${Math.round(order.totalPrice || 0).toLocaleString('en-IN')}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Order Date:</span>
                  <span style="color: #666;">${new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>

              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <h4 style="color: #4caf50; margin: 0 0 10px 0;">What's Next?</h4>
                <p style="color: #666; margin: 0; line-height: 1.5;">
                  ${status === 'Shipped' 
                    ? 'Your order is on its way! You should receive it within 2-3 business days.' 
                    : status === 'Delivered' 
                    ? 'Thank you for choosing Sri Santhoshimatha Aqua Bazar. We hope you are satisfied with your purchase!' 
                    : status === 'Cancelled'
                    ? 'If you have any questions about the cancellation, please don\'t hesitate to contact us.'
                    : 'We\'ll keep you updated as your order progresses through our fulfillment process.'
                  }
                </p>
              </div>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0 0 10px 0;">Need help? Contact us:</p>
                <p style="color: #667eea; margin: 0; font-weight: bold;">📞 +91-XXXXXXXXXX | 📧 support@srisanthoshimatha.com</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sri Santhoshimatha Aqua Bazar. All rights reserved.
              </p>
            </div>
          </div>
        `;

        await sendEmail(
          order.user.email,
          `Order #${orderNumber} Status Update - ${status}`,
          emailContent
        );

        console.log(`Email notification sent to ${order.user.email} for order ${orderNumber} status change to ${status}`);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the status update if email fails
      }
    }
    
    const updatedOrder = await Order.findById(id).populate('user', 'name email');
    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    next(err);
  }
};

// Get count of pending orders for notification badge
exports.getPendingOrdersCount = async (req, res, next) => {
  try {
    const count = await Order.countDocuments({ status: 'Pending' });
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
