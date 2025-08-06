import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const { currentTheme } = useTheme();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders/my');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders. Please try again.');
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Confirmed': return '✅';
      case 'Processing': return '🔄';
      case 'Shipped': return '🚚';
      case 'Delivered': return '📦';
      case 'Cancelled': return '❌';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const calculateOrderTotal = (order) => {
    try {
      // First try to use the stored totalPrice
      if (order.totalPrice && !isNaN(order.totalPrice) && order.totalPrice > 0) {
        return order.totalPrice;
      }
      
      // If no totalPrice, calculate from items
      if (!order.items || !Array.isArray(order.items)) return 0;
      
      return order.items.reduce((total, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating order total:', error);
      return order.totalPrice || 0;
    }
  };

  const orderStatuses = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  const filteredOrders = orders.filter(order => 
    statusFilter === 'All' || order.status === statusFilter
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: currentTheme.text,
        background: currentTheme.background,
        minHeight: '100vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📦</div>
          <div style={{ fontSize: '18px' }}>Loading your orders...</div>
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
        padding: '25px',
        marginBottom: '25px',
        boxShadow: `0 4px 15px ${currentTheme.shadow}`,
        border: `1px solid ${currentTheme.border || '#e0e0e0'}`
      }}>
        <h1 style={{ 
          color: currentTheme.primary, 
          margin: '0 0 20px 0',
          fontSize: '32px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🛍️ My Orders
        </h1>
        
        {/* Stats and Filter */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: currentTheme.background,
              padding: '12px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border || '#e0e0e0'}`
            }}>
              <strong>Total Orders:</strong> {filteredOrders.length}
            </div>
            <div style={{
              background: currentTheme.background,
              padding: '12px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              color: currentTheme.text,
              border: `1px solid ${currentTheme.border || '#e0e0e0'}`
            }}>
              <strong>Total Spent:</strong> ₹{filteredOrders.reduce((sum, order) => sum + calculateOrderTotal(order), 0).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                border: `2px solid ${currentTheme.primary}`,
                borderRadius: '8px',
                fontSize: '14px',
                background: currentTheme.background,
                color: currentTheme.text,
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px',
                fontWeight: '500'
              }}
            >
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Orders' : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{
          background: currentTheme.card,
          borderRadius: '12px',
          padding: '60px 40px',
          textAlign: 'center',
          color: currentTheme.textSecondary,
          boxShadow: `0 4px 15px ${currentTheme.shadow}`,
          border: `1px solid ${currentTheme.border || '#e0e0e0'}`
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
          <h2 style={{ color: currentTheme.text, margin: '0 0 15px 0' }}>
            {statusFilter === 'All' ? 'No Orders Yet' : `No ${statusFilter} Orders`}
          </h2>
          <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
            {statusFilter === 'All' 
              ? "You haven't placed any orders yet. Start shopping to see your orders here!" 
              : `You don't have any ${statusFilter.toLowerCase()} orders at the moment.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map(order => (
            <div 
              key={order._id} 
              style={{ 
                background: currentTheme.card,
                borderRadius: '12px',
                padding: '25px',
                boxShadow: `0 4px 15px ${currentTheme.shadow}`,
                border: expandedOrder === order._id 
                  ? `2px solid ${currentTheme.primary}` 
                  : `1px solid ${currentTheme.border || '#e0e0e0'}`,
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {/* Order Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h3 style={{ 
                    color: currentTheme.primary, 
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: '600'
                  }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p style={{ 
                    color: currentTheme.textSecondary, 
                    margin: '0 0 5px 0',
                    fontSize: '14px'
                  }}>
                    📅 Placed on {formatDate(order.createdAt)}
                  </p>
                  <p style={{ 
                    color: currentTheme.text, 
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    💰 Total: ₹{Math.round(calculateOrderTotal(order)).toLocaleString('en-IN')}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Status Badge */}
                  <div style={{
                    background: getStatusColor(order.status || 'Pending'),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: `0 2px 8px ${getStatusColor(order.status || 'Pending')}40`
                  }}>
                    <span>{getStatusIcon(order.status || 'Pending')}</span>
                    {order.status || 'Pending'}
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    style={{
                      background: 'transparent',
                      border: `2px solid ${currentTheme.primary}`,
                      color: currentTheme.primary,
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = currentTheme.primary;
                      e.currentTarget.style.color = currentTheme.buttonText || 'white';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = currentTheme.primary;
                    }}
                  >
                    {expandedOrder === order._id ? '▲ Less Details' : '▼ View Details'}
                  </button>
                </div>
              </div>

              {/* Quick Items Preview */}
              <div style={{ 
                background: currentTheme.background,
                borderRadius: '8px',
                padding: '15px',
                marginBottom: expandedOrder === order._id ? '20px' : '0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  <span style={{ fontSize: '16px' }}>🛒</span>
                  <strong style={{ color: currentTheme.text }}>
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </strong>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px'
                }}>
                  {(order.items || []).slice(0, 3).map((item, index) => (
                    <span 
                      key={index}
                      style={{
                        background: currentTheme.card,
                        color: currentTheme.textSecondary,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        border: `1px solid ${currentTheme.border || '#e0e0e0'}`
                      }}
                    >
                      {item.name}
                    </span>
                  ))}
                  {(order.items?.length || 0) > 3 && (
                    <span style={{
                      color: currentTheme.textSecondary,
                      fontSize: '12px',
                      padding: '4px 8px'
                    }}>
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div style={{ 
                  borderTop: `1px solid ${currentTheme.border || '#e0e0e0'}`,
                  paddingTop: '20px'
                }}>
                  {/* Detailed Items */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ 
                      color: currentTheme.text, 
                      marginBottom: '15px',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      📋 Order Items
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(order.items || []).map((item, index) => (
                        <div key={index} style={{
                          background: currentTheme.background,
                          padding: '15px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          border: `1px solid ${currentTheme.border || '#e0e0e0'}`
                        }}>
                          <div>
                            <span style={{ 
                              color: currentTheme.text, 
                              fontWeight: '500',
                              fontSize: '15px'
                            }}>
                              {item.name || 'Product'}
                            </span>
                            <div style={{ 
                              color: currentTheme.textSecondary,
                              fontSize: '13px',
                              marginTop: '4px'
                            }}>
                              Quantity: {item.quantity || 1}
                            </div>
                          </div>
                          <div style={{ 
                            color: currentTheme.primary, 
                            fontWeight: '600',
                            fontSize: '16px'
                          }}>
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  {order.shipping && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ 
                        color: currentTheme.text, 
                        marginBottom: '15px',
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        🏠 Shipping Details
                      </h4>
                      <div style={{
                        background: currentTheme.background,
                        padding: '20px',
                        borderRadius: '8px',
                        border: `1px solid ${currentTheme.border || '#e0e0e0'}`,
                        lineHeight: '1.6'
                      }}>
                        <div style={{ color: currentTheme.text, marginBottom: '8px' }}>
                          <strong>Address:</strong> {order.shipping.address || 'N/A'}
                        </div>
                        {order.shipping.landmark && (
                          <div style={{ color: currentTheme.text, marginBottom: '8px' }}>
                            <strong>Landmark:</strong> {order.shipping.landmark}
                          </div>
                        )}
                        {order.shipping.city && (
                          <div style={{ color: currentTheme.text, marginBottom: '8px' }}>
                            <strong>Location:</strong> {order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}
                          </div>
                        )}
                        {order.shipping.phone && (
                          <div style={{ color: currentTheme.text, marginBottom: '8px' }}>
                            <strong>Phone:</strong> {order.shipping.phone}
                          </div>
                        )}
                        {order.shipping.paymentMethod && (
                          <div style={{ color: currentTheme.text }}>
                            <strong>Payment Method:</strong> {order.shipping.paymentMethod}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Timeline */}
                  <div>
                    <h4 style={{ 
                      color: currentTheme.text, 
                      marginBottom: '15px',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      📈 Order Timeline
                    </h4>
                    <div style={{
                      background: currentTheme.background,
                      padding: '20px',
                      borderRadius: '8px',
                      border: `1px solid ${currentTheme.border || '#e0e0e0'}`
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        color: currentTheme.text
                      }}>
                        <span style={{ fontSize: '16px' }}>{getStatusIcon(order.status || 'Pending')}</span>
                        <strong>Current Status: {order.status || 'Pending'}</strong>
                      </div>
                      <div style={{ 
                        color: currentTheme.textSecondary,
                        fontSize: '14px',
                        marginTop: '8px'
                      }}>
                        Order placed on {formatDate(order.createdAt)}
                        {order.updatedAt && order.updatedAt !== order.createdAt && (
                          <span> • Last updated on {formatDate(order.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
