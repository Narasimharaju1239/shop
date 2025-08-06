import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { currentTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products')
      .then(res => {
        setProducts(res.data);
        // Initialize quantities for all products
        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      })
      .catch(() => toast.error('Failed to fetch products'));
  }, []);

  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleAddToCart = async (product) => {
    const quantity = quantities[product._id] || 1;
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      // Call the backend API directly to add with quantity
      const res = await API.post('/cart/add', { 
        productId: product._id, 
        quantity: quantity 
      });
      setCartItems(res.data.items);
      toast.success(`Added ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <>
      <style>{`
        /* Base grid - responsive auto-fit using full width */
        .products-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
          width: 100% !important;
        }
        
        /* Desktop - more products per row using full width */
        @media (min-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 20px !important;
          }
        }
        
        /* Large screens - utilize full width */
        @media (min-width: 1600px) {
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
            gap: 24px !important;
          }
        }
        
        /* Extra large screens */
        @media (min-width: 2000px) {
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
          }
        }
        
        /* Tablets */
        @media (max-width: 768px) {
          .products-container {
            padding: 20px 16px !important;
          }
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 20px !important;
          }
          .product-card {
            min-height: 320px !important;
            padding: 16px !important;
          }
          .product-title {
            font-size: 28px !important;
            margin-bottom: 20px !important;
          }
          .product-image {
            height: 160px !important;
          }
          .product-name {
            font-size: 18px !important;
          }
          .product-price {
            font-size: 20px !important;
          }
        }
        
        /* Mobile */
        @media (max-width: 480px) {
          .products-container {
            padding: 16px 12px !important;
          }
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .product-card {
            min-height: 300px !important;
            padding: 14px !important;
          }
          .product-title {
            font-size: 24px !important;
            margin-bottom: 16px !important;
          }
          .product-image {
            height: 200px !important;
          }
          .product-name {
            font-size: 18px !important;
          }
          .product-price {
            font-size: 20px !important;
          }
          .add-to-cart-btn {
            font-size: 16px !important;
            padding: 12px 0 !important;
          }
        }
      `}</style>
      
      <div 
        className="products-container"
        style={{
          padding: '30px 20px',
          background: currentTheme.background,
          minHeight: 'calc(100vh - 56px)',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <h2 
          className="product-title"
          style={{ 
            textAlign: 'center', 
            color: currentTheme.primary, 
            fontWeight: 800, 
            letterSpacing: 1, 
            marginBottom: 30, 
            fontSize: 32 
          }}
        >
          All Products
        </h2>
        
        <div 
          className="products-grid"
          style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px', 
            marginTop: '10px',
            alignItems: 'stretch',
            width: '100%',
            margin: '0'
          }}
        >
        {products.map(p => (
          <div
            key={p._id}
            className="product-card"
            style={{
              border: 'none',
              borderRadius: '12px',
              boxShadow: `0 4px 20px ${currentTheme.shadow}`,
              padding: '18px',
              textAlign: 'center',
              background: currentTheme.card,
              color: currentTheme.text,
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s',
              minHeight: 350,
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              outline: '2px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 30px ${currentTheme.shadow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = `0 4px 20px ${currentTheme.shadow}`;
            }}
            onClick={e => {
              if (e.target.tagName !== 'BUTTON') {
                navigate(`/customer/products/${p._id}`);
              }
            }}
          >
            <div>
              <img
                className="product-image"
                src={p.image ? (p.image.startsWith('/uploads/') ? `http://localhost:5000${p.image}` : p.image) : '/no-image.png'}
                alt={p.name}
                style={{ 
                  width: '100%', 
                  height: '180px', 
                  objectFit: 'cover', 
                  borderRadius: '8px', 
                  marginBottom: 14, 
                  boxShadow: `0 2px 8px ${currentTheme.shadow}` 
                }}
                onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
              />
              <h4 
                className="product-name"
                style={{ 
                  fontWeight: 700, 
                  margin: '10px 0 8px 0', 
                  fontSize: 20, 
                  color: currentTheme.text, 
                  letterSpacing: 0.5 
                }}
              >
                {p.name}
              </h4>
              
              {/* Discount and price display */}
              {p.offer && Number(p.offer) > 0 ? (
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <span style={{ 
                    color: '#e53935', 
                    fontWeight: 700, 
                    fontSize: 18, 
                    marginRight: 8 
                  }}>
                    -{p.offer}%
                  </span>
                  <div 
                    className="product-price"
                    style={{ 
                      fontWeight: 700, 
                      fontSize: 22, 
                      color: currentTheme.primary, 
                      marginBottom: 4 
                    }}
                  >
                    ₹{(Number(p.price) * (1 - Number(p.offer) / 100)).toLocaleString('en-IN')}
                  </div>
                  <div style={{ color: currentTheme.textSecondary, fontSize: 14 }}>
                    M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{Number(p.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ) : (
                <div 
                  className="product-price"
                  style={{ 
                    fontWeight: 700, 
                    fontSize: 22, 
                    color: currentTheme.primary, 
                    marginBottom: 12,
                    textAlign: 'center'
                  }}
                >
                  ₹{Number(p.price).toLocaleString('en-IN')}
                </div>
              )}
            </div>
            
            {/* Quantity Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              gap: '8px'
            }}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  updateQuantity(p._id, -1);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: `2px solid ${currentTheme.primary}`,
                  background: currentTheme.card,
                  color: currentTheme.primary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = currentTheme.primary;
                  e.currentTarget.style.color = currentTheme.buttonText;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = currentTheme.card;
                  e.currentTarget.style.color = currentTheme.primary;
                }}
              >
                -
              </button>
              
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: currentTheme.text,
                minWidth: '30px',
                textAlign: 'center',
                padding: '4px 8px',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '4px',
                background: currentTheme.card
              }}>
                {quantities[p._id] || 1}
              </span>
              
              <button
                onClick={e => {
                  e.stopPropagation();
                  updateQuantity(p._id, 1);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: `2px solid ${currentTheme.primary}`,
                  background: currentTheme.card,
                  color: currentTheme.primary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = currentTheme.primary;
                  e.currentTarget.style.color = currentTheme.buttonText;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = currentTheme.card;
                  e.currentTarget.style.color = currentTheme.primary;
                }}
              >
                +
              </button>
            </div>
            
            <button
              className="add-to-cart-btn"
              onClick={e => {
                e.stopPropagation();
                handleAddToCart(p);
              }}
              style={{
                padding: '10px 0', 
                background: currentTheme.button, 
                color: currentTheme.buttonText,
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 600, 
                fontSize: 16,
                marginTop: 'auto', 
                boxShadow: `0 2px 8px ${currentTheme.shadow}`, 
                letterSpacing: 0.5,
                transition: 'all 0.2s ease',
                width: '100%'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default Products;
