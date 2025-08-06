import React, { useEffect, useState, useCallback } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState([]); // Fix: array instead of null
  const [refreshing, setRefreshing] = useState(false);
  const [showNewOrdersOnly, setShowNewOrdersOnly] = useState(false);
  const [groupedOrders, setGroupedOrders] = useState({});
  const { currentTheme } = useTheme();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      const response = await API.get('/orders');
      
      if (response && response.data) {
        console.log('Orders loaded:', response.data); // Debug log
        setOrders(response.data);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      toast.error(`Failed to load orders: ${errorMessage}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // Remove problematic dependencies

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filterOrders = useCallback(() => {
    try {
      let filtered = [...orders]; // Create a copy to avoid mutations

      // Filter by status
      if (statusFilter && statusFilter !== 'All') {
        filtered = filtered.filter(order => {
          const orderStatus = order.status || 'Pending';
          return orderStatus === statusFilter;
        });
      }

      // Filter by new orders only
      if (showNewOrdersOnly) {
        filtered = filtered.filter(order => {
          const orderStatus = order.status || 'Pending';
          return orderStatus === 'Pending';
        });
      }

      // Filter by search term (customer name, order ID, or phone)
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(order => {
          const customerName = order.user?.name || order.shipping?.name || '';
          const orderId = order._id || '';
          const phone = order.shipping?.phone || '';
          const altPhone = order.shipping?.alternativePhone || '';
          
          return (
            customerName.toLowerCase().includes(searchLower) ||
            orderId.toLowerCase().includes(searchLower) ||
            phone.includes(searchTerm.trim()) ||
            altPhone.includes(searchTerm.trim())
          );
        });
      }

      setFilteredOrders(filtered);

      // Group orders by day
      const grouped = filtered.reduce((acc, order) => {
        try {
          const orderDate = new Date(order.createdAt || Date.now());
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          let dayKey;
          if (orderDate.toDateString() === today.toDateString()) {
            dayKey = 'Today';
          } else if (orderDate.toDateString() === yesterday.toDateString()) {
            dayKey = 'Yesterday';
          } else {
            dayKey = orderDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });
          }

          if (!acc[dayKey]) {
            acc[dayKey] = [];
          }
          acc[dayKey].push(order);
        } catch (error) {
          console.error('Error grouping order by date:', error);
          if (!acc['Unknown Date']) {
            acc['Unknown Date'] = [];
          }
          acc['Unknown Date'].push(order);
        }
        return acc;
      }, {});

      // Sort days (Today first, then Yesterday, then chronological)
      const sortedGrouped = {};
      const dayKeys = Object.keys(grouped);
      
      // Sort keys with Today first, Yesterday second, then reverse chronological
      dayKeys.sort((a, b) => {
        if (a === 'Today') return -1;
        if (b === 'Today') return 1;
        if (a === 'Yesterday') return -1;
        if (b === 'Yesterday') return 1;
        if (a === 'Unknown Date') return 1;
        if (b === 'Unknown Date') return -1;
        
        // For other dates, sort in reverse chronological order (newer first)
        const dateA = new Date(a.split(' ').slice(-3).join(' '));
        const dateB = new Date(b.split(' ').slice(-3).join(' '));
        return dateB - dateA;
      });

      dayKeys.forEach(key => {
        // Sort orders within each day by creation time (newest first)
        sortedGrouped[key] = grouped[key].sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      });

      setGroupedOrders(sortedGrouped);
    } catch (error) {
      console.error('Error filtering orders:', error);
      toast.error('Error filtering orders. Please try again.');
    }
  }, [orders, statusFilter, searchTerm, showNewOrdersOnly]);

  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      toast.error('Invalid order ID or status');
      return;
    }

    if (updatingStatus.includes(orderId)) {
      toast.warning('Status update already in progress for this order');
      return;
    }

    try {
      setUpdatingStatus(prev => [...prev, orderId]);
      
      const response = await API.patch(`/orders/${orderId}`, { 
        status: newStatus,
        sendEmailNotification: true // Flag to trigger email notification
      });
      
      if (response && response.data) {
        // Update the orders state with the response data
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...response.data, updatedAt: new Date().toISOString() }
              : order
          )
        );
        toast.success(`Order status updated to ${newStatus} and customer notified via email`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to update order status';
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(prev => prev.filter(id => id !== orderId));
    }
  };

  const calculateOrderTotal = (order) => {
    try {
      if (!order) {
        console.warn('Invalid order data for total calculation:', order);
        return 0;
      }

      // First try to use the totalPrice from the order
      if (order.totalPrice && !isNaN(order.totalPrice) && order.totalPrice > 0) {
        return order.totalPrice;
      }

      // If no totalPrice, calculate from items
      if (!order.items || !Array.isArray(order.items)) {
        console.warn('No valid items in order:', order);
        return 0;
      }

      return order.items.reduce((total, item) => {
        if (!item) return total;
        
        // Try different price sources - now items should have direct price and quantity
        const price = item.price || item.product?.price || 0;
        const quantity = item.quantity || 1;
        
        // Validate numeric values
        if (isNaN(price) || isNaN(quantity)) {
          console.warn('Invalid numeric values in order item:', item);
          return total;
        }
        
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating order total:', error);
      return order?.totalPrice || 0;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FF9800';
      case 'Confirmed': return '#2196F3';
      case 'Processing': return '#9C27B0';
      case 'Shipped': return '#FF5722';
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#F44336';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const orderStatuses = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: currentTheme.text 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
          <div>Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      background: currentTheme.background,
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        background: currentTheme.card,
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: `0 2px 10px ${currentTheme.shadow}`
      }}>
        <h1 style={{ 
          color: currentTheme.primary, 
          margin: '0 0 15px 0',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          📦 Manage Orders
        </h1>
        
        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ flex: '1', minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Search by customer name, order ID, or phone..."
              value={searchTerm}
              onChange={(e) => {
                try {
                  setSearchTerm(e.target.value);
                } catch (error) {
                  console.error('Error updating search term:', error);
                  toast.error('Error updating search. Please try again.');
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '8px',
                fontSize: '14px',
                background: currentTheme.background,
                color: currentTheme.text,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                try {
                  setStatusFilter(e.target.value);
                } catch (error) {
                  console.error('Error updating status filter:', error);
                  toast.error('Error updating filter. Please try again.');
                }
              }}
              style={{
                padding: '12px',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '8px',
                fontSize: '14px',
                background: currentTheme.background,
                color: currentTheme.text,
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Orders' : status}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={async () => {
              try {
                await loadOrders();
                toast.success('Orders refreshed successfully');
              } catch (error) {
                console.error('Error refreshing orders:', error);
                toast.error('Error refreshing orders. Please try again.');
              }
            }}
            disabled={refreshing}
            style={{
              padding: '12px 20px',
              background: refreshing ? currentTheme.muted : currentTheme.primary,
              color: currentTheme.buttonText,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: refreshing ? 0.7 : 1
            }}
            onMouseEnter={e => {
              if (!refreshing) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={e => {
              if (!refreshing) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>

          {/* New Orders Button */}
          <button
            onClick={() => {
              try {
                setShowNewOrdersOnly(!showNewOrdersOnly);
                if (!showNewOrdersOnly) {
                  toast.info('Showing new orders only (Pending status)');
                } else {
                  toast.info('Showing all orders');
                }
              } catch (error) {
                console.error('Error toggling new orders filter:', error);
                toast.error('Error updating filter. Please try again.');
              }
            }}
            style={{
              padding: '12px 20px',
              background: showNewOrdersOnly ? '#FF9800' : currentTheme.background,
              color: showNewOrdersOnly ? 'white' : currentTheme.primary,
              border: `2px solid ${showNewOrdersOnly ? '#FF9800' : currentTheme.primary}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={e => {
              if (!showNewOrdersOnly) {
                e.currentTarget.style.background = currentTheme.primary;
                e.currentTarget.style.color = currentTheme.buttonText;
              }
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              if (!showNewOrdersOnly) {
                e.currentTarget.style.background = currentTheme.background;
                e.currentTarget.style.color = currentTheme.primary;
              }
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {showNewOrdersOnly ? (
              <>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>
                  {filteredOrders.filter(order => (order.status || 'Pending') === 'Pending').length}
                </span>
                📦 New Orders (Active)
              </>
            ) : (
              <>
                <span style={{
                  background: currentTheme.primary,
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>
                  {orders.filter(order => (order.status || 'Pending') === 'Pending').length}
                </span>
                📦 New Orders
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '15px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: currentTheme.background,
            padding: '10px 15px',
            borderRadius: '6px',
            fontSize: '14px',
            color: currentTheme.text
          }}>
            <strong>Total Orders:</strong> {filteredOrders.length}
          </div>
          <div style={{
            background: currentTheme.background,
            padding: '10px 15px',
            borderRadius: '6px',
            fontSize: '14px',
            color: currentTheme.text
          }}>
            <strong>Total Revenue:</strong> ₹{filteredOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0).toLocaleString('en-IN')}
          </div>
          <div style={{
            background: currentTheme.background,
            padding: '10px 15px',
            borderRadius: '6px',
            fontSize: '14px',
            color: currentTheme.text
          }}>
            <strong>New Orders:</strong> {orders.filter(order => (order.status || 'Pending') === 'Pending').length}
          </div>
          <div style={{
            background: currentTheme.background,
            padding: '10px 15px',
            borderRadius: '6px',
            fontSize: '14px',
            color: currentTheme.text
          }}>
            <strong>Days Shown:</strong> {Object.keys(groupedOrders).length}
          </div>
          {showNewOrdersOnly && (
            <div style={{
              background: '#FF9800',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              📦 Showing New Orders Only
            </div>
          )}
        </div>
      </div>

      {/* Orders List - Day-wise Grouping */}
      {filteredOrders.length === 0 ? (
        <div style={{
          background: currentTheme.card,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: currentTheme.textSecondary,
          boxShadow: `0 2px 10px ${currentTheme.shadow}`
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
          <h3 style={{ color: currentTheme.text, margin: '0 0 10px 0' }}>No Orders Found</h3>
          <p style={{ margin: 0 }}>
            {showNewOrdersOnly 
              ? 'No new orders at the moment.'
              : searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {Object.entries(groupedOrders).map(([dayKey, dayOrders]) => (
            <div key={dayKey} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Day Header */}
              <div style={{
                background: currentTheme.card,
                borderRadius: '8px',
                padding: '15px 20px',
                boxShadow: `0 2px 8px ${currentTheme.shadow}`,
                border: `1px solid ${currentTheme.primary}20`
              }}>
                <h3 style={{ 
                  color: currentTheme.primary, 
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  📅 {dayKey}
                  <span style={{
                    background: currentTheme.primary,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {dayOrders.length} order{dayOrders.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{
                    background: currentTheme.background,
                    color: currentTheme.text,
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ₹{dayOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0).toLocaleString('en-IN')}
                  </span>
                </h3>
              </div>

              {/* Orders for this day */}
              {dayOrders.map(order => (
            <div 
              key={order._id} 
              style={{ 
                background: currentTheme.card,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: `0 2px 10px ${currentTheme.shadow}`,
                border: expandedOrder === order._id ? `2px solid ${currentTheme.primary}` : `1px solid ${currentTheme.textSecondary}20`,
                transition: 'all 0.3s ease'
              }}
            >
              {/* Order Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '15px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <h3 style={{ 
                    color: currentTheme.primary, 
                    margin: '0 0 5px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p style={{ 
                    color: currentTheme.textSecondary, 
                    margin: '0',
                    fontSize: '14px'
                  }}>
                    📅 {formatDate(order.createdAt || Date.now())}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Status Badge */}
                  <span style={{
                    background: getStatusColor(order.status || 'Pending'),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {order.status || 'Pending'}
                  </span>

                  {/* Expand Button */}
                  <button
                    onClick={() => {
                      try {
                        setExpandedOrder(expandedOrder === order._id ? null : order._id);
                      } catch (error) {
                        console.error('Error toggling order expansion:', error);
                        toast.error('Error expanding order details. Please try again.');
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${currentTheme.primary}`,
                      color: currentTheme.primary,
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {expandedOrder === order._id ? '▲ Less' : '▼ More'}
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: expandedOrder === order._id ? '20px' : '0'
              }}>
                <div>
                  <strong style={{ color: currentTheme.text }}>👤 Customer:</strong>
                  <p style={{ margin: '5px 0', color: currentTheme.textSecondary }}>
                    {order.user?.name || order.shipping?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <strong style={{ color: currentTheme.text }}>📞 Phone:</strong>
                  <p style={{ margin: '5px 0', color: currentTheme.textSecondary }}>
                    {order.shipping?.phone || order.user?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <strong style={{ color: currentTheme.text }}>💳 Payment:</strong>
                  <p style={{ margin: '5px 0', color: currentTheme.textSecondary }}>
                    {order.shipping?.paymentMethod || 'N/A'}
                  </p>
                </div>
                <div>
                  <strong style={{ color: currentTheme.text }}>💰 Total:</strong>
                  <p style={{ margin: '5px 0', color: currentTheme.primary, fontWeight: '600', fontSize: '16px' }}>
                    ₹{Math.round(calculateOrderTotal(order)).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div style={{ 
                  borderTop: `1px solid ${currentTheme.textSecondary}20`,
                  paddingTop: '20px'
                }}>
                  {/* Items */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: currentTheme.text, marginBottom: '10px' }}>🛒 Order Items:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(order.items || []).map((item, index) => {
                        try {
                          // Handle new order item structure
                          const itemName = item.name || item.product?.name || `Product ${index + 1}`;
                          const itemPrice = item.price || item.product?.price || 0;
                          const itemQuantity = item.quantity || 1;
                          const itemOffer = item.offer || item.product?.offer || 0;
                          
                          // Calculate final price (price in DB should already be discounted)
                          const itemTotal = itemPrice * itemQuantity;
                          
                          return (
                            <div key={index} style={{
                              background: currentTheme.background,
                              padding: '10px',
                              borderRadius: '6px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div>
                                <span style={{ color: currentTheme.text, fontWeight: '500' }}>
                                  {itemName}
                                </span>
                                <div style={{ color: currentTheme.textSecondary, fontSize: '12px', marginTop: '2px' }}>
                                  Qty: {itemQuantity} × ₹{itemPrice.toLocaleString('en-IN')}
                                  {itemOffer > 0 && (
                                    <span style={{ color: '#4CAF50', marginLeft: '5px' }}>
                                      ({itemOffer}% off applied)
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div style={{ color: currentTheme.primary, fontWeight: '600' }}>
                                ₹{Math.round(itemTotal).toLocaleString('en-IN')}
                              </div>
                            </div>
                          );
                        } catch (error) {
                          console.error('Error rendering item:', error, item);
                          return (
                            <div key={index} style={{
                              background: currentTheme.background,
                              padding: '10px',
                              borderRadius: '6px',
                              color: currentTheme.textSecondary
                            }}>
                              Error displaying item #{index + 1}
                              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                                Raw data: {JSON.stringify(item)}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: currentTheme.text, marginBottom: '10px' }}>🏠 Shipping Address:</h4>
                    <div style={{
                      background: currentTheme.background,
                      padding: '15px',
                      borderRadius: '6px',
                      color: currentTheme.textSecondary,
                      lineHeight: '1.5'
                    }}>
                      {order.shipping?.address ? (
                        <>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Address:</strong> {order.shipping.address}
                          </div>
                          {order.shipping.landmark && (
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Landmark:</strong> {order.shipping.landmark}
                            </div>
                          )}
                          {(order.shipping.city || order.shipping.state || order.shipping.pincode) && (
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Location:</strong> {[order.shipping.city, order.shipping.state, order.shipping.pincode].filter(Boolean).join(', ')}
                            </div>
                          )}
                          {(order.shipping.phone || order.user?.phone) && (
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Phone:</strong> {order.shipping.phone || order.user?.phone}
                            </div>
                          )}
                          {order.shipping.alternativePhone && (
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Alt. Phone:</strong> {order.shipping.alternativePhone}
                            </div>
                          )}
                          {order.shipping.paymentMethod && (
                            <div>
                              <strong>Payment Method:</strong> {order.shipping.paymentMethod}
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ fontStyle: 'italic' }}>
                          No shipping address available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h4 style={{ color: currentTheme.text, marginBottom: '10px' }}>📋 Update Status:</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {orderStatuses.slice(1).map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            try {
                              updateOrderStatus(order._id, status);
                            } catch (error) {
                              console.error('Error updating order status:', error);
                              toast.error('Error updating status. Please try again.');
                            }
                          }}
                          disabled={order.status === status || updatingStatus.includes(order._id)}
                          style={{
                            padding: '8px 12px',
                            background: order.status === status ? getStatusColor(status) : 'transparent',
                            color: order.status === status ? 'white' : getStatusColor(status),
                            border: `1px solid ${getStatusColor(status)}`,
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: (order.status === status || updatingStatus.includes(order._id)) ? 'not-allowed' : 'pointer',
                            opacity: (order.status === status || updatingStatus.includes(order._id)) ? 0.7 : 1,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={e => {
                            if (order.status !== status && !updatingStatus.includes(order._id)) {
                              e.currentTarget.style.background = getStatusColor(status);
                              e.currentTarget.style.color = 'white';
                            }
                          }}
                          onMouseLeave={e => {
                            if (order.status !== status && !updatingStatus.includes(order._id)) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = getStatusColor(status);
                            }
                          }}
                        >
                          {updatingStatus.includes(order._id) && order.status !== status ? '⏳ Updating...' : status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
