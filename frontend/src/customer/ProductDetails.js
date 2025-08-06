import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import { CartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        toast.error('Product not found');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        color: currentTheme.text,
        background: currentTheme.background,
        minHeight: 'calc(100vh - 56px)'
      }}>
        <div style={{
          fontSize: '18px',
          color: currentTheme.textSecondary
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .product-details-container {
            flex-direction: column !important;
            padding: 20px 16px !important;
          }
          .product-image-container {
            max-width: 100% !important;
            margin-bottom: 20px !important;
          }
          .product-info-container {
            max-width: 100% !important;
          }
          .product-details-image {
            height: 250px !important;
          }
          .product-details-title {
            font-size: 24px !important;
          }
          .product-details-price {
            font-size: 22px !important;
          }
        }
        @media (max-width: 480px) {
          .product-details-container {
            padding: 16px 12px !important;
          }
          .product-details-image {
            height: 200px !important;
          }
          .product-details-title {
            font-size: 20px !important;
          }
          .product-details-price {
            font-size: 20px !important;
          }
          .add-to-cart-details-btn {
            font-size: 14px !important;
            padding: 12px 20px !important;
          }
        }
      `}</style>
      
      <div 
        className="product-details-container"
        style={{
          padding: '30px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '30px',
          minHeight: 'calc(100vh - 56px)',
          background: currentTheme.background,
          color: currentTheme.text,
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div 
          className="product-image-container"
          style={{ 
            flex: '1 1 300px', 
            maxWidth: '500px',
            minWidth: '300px'
          }}
        >
          <img
            className="product-details-image"
            src={product.image ? (product.image.startsWith('/uploads/') ? `http://localhost:5000${product.image}` : product.image) : '/no-image.png'}
            alt={product.name}
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: '12px',
              boxShadow: `0 8px 24px ${currentTheme.shadow}`,
              border: `1px solid ${currentTheme.border}`
            }}
            onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
          />
        </div>
        
        <div 
          className="product-info-container"
          style={{ 
            flex: '1 1 300px', 
            maxWidth: '500px',
            minWidth: '300px'
          }}
        >
          <h2 
            className="product-details-title"
            style={{ 
              color: currentTheme.text,
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}
          >
            {product.name}
          </h2>
          
          <div style={{
            background: currentTheme.surface,
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: `1px solid ${currentTheme.border}`
          }}>
            {product.offer && Number(product.offer) > 0 ? (
              <div style={{ marginBottom: '12px' }}>
                <span style={{ 
                  color: '#e53935', 
                  fontWeight: 700, 
                  fontSize: 20, 
                  marginRight: 12,
                  background: '#ffebee',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  -{product.offer}% OFF
                </span>
                <div 
                  className="product-details-price"
                  style={{ 
                    fontWeight: 700, 
                    fontSize: 28, 
                    color: currentTheme.primary, 
                    marginTop: 8
                  }}
                >
                  ₹{(Number(product.price) * (1 - Number(product.offer) / 100)).toLocaleString('en-IN')}
                </div>
                <div style={{ 
                  color: currentTheme.textSecondary, 
                  fontSize: 16,
                  marginTop: 4
                }}>
                  M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{Number(product.price).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <div 
                className="product-details-price"
                style={{ 
                  fontWeight: 700, 
                  fontSize: 28, 
                  color: currentTheme.primary,
                  marginBottom: 12
                }}
              >
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {product.description && (
            <div style={{
              background: currentTheme.surface,
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <h3 style={{ 
                color: currentTheme.text,
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Description
              </h3>
              <p style={{ 
                fontSize: '16px', 
                color: currentTheme.textSecondary,
                lineHeight: '1.6',
                margin: 0
              }}>
                {product.description}
              </p>
            </div>
          )}
          
          {product.details && (
            <div style={{
              background: currentTheme.surface,
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <h3 style={{ 
                color: currentTheme.text,
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Details
              </h3>
              <div style={{ 
                color: currentTheme.textSecondary,
                fontSize: '16px',
                lineHeight: '1.6',
                whiteSpace: 'pre-line'
              }}>
                {product.details}
              </div>
            </div>
          )}
          
          <button
            className="add-to-cart-details-btn"
            onClick={() => addToCart(product)}
            style={{
              padding: '16px 32px',
              background: currentTheme.button,
              color: currentTheme.buttonText,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 16,
              width: '100%',
              maxWidth: '300px',
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${currentTheme.shadow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.shadow}`;
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
