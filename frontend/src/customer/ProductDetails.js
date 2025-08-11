import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTruck, FaShareAlt, FaFacebook, FaWhatsapp, FaStar, FaRegStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import { CartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [company, setCompany] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState({ user: '', rating: 0, comment: '' });
  const [related, setRelated] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        // Fetch company info only if companyId is valid (not null, not empty, not undefined)
        if (res.data.companyId && typeof res.data.companyId === 'string' && res.data.companyId.length === 24) {
          try {
            const companyRes = await API.get(`/companies/${res.data.companyId}`);
            setCompany(companyRes.data);
          } catch (err) {
            setCompany(null); // If not found, set to null
          }
        } else {
          setCompany(null);
        }
        // Fetch reviews (dummy for now)
        setReviews([
          { user: 'Amit', rating: 5, comment: 'Excellent product!' },
          { user: 'Priya', rating: 4, comment: 'Good value for money.' },
        ]);
        // Fetch related products (dummy for now)
        setRelated([
          { _id: 'r1', name: 'Related Product 1', image: '/no-image.png', price: 999 },
          { _id: 'r2', name: 'Related Product 2', image: '/no-image.png', price: 1299 }
        ]);
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
          .breadcrumbs {
            justify-content: center !important;
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
      {/* Centered Breadcrumbs */}
      <div className="breadcrumbs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 18 }}>
        <Link to="/customer/products" style={{ color: currentTheme.primary, textDecoration: 'none', fontWeight: 500 }}>Products</Link>
        <span style={{ margin: '0 8px', color: currentTheme.textSecondary }}>/</span>
        <span style={{ color: currentTheme.text }}>{product.name}</span>
      </div>
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
        {/* Image Carousel */}
        <div className="product-image-container" style={{ flex: '1 1 300px', maxWidth: '500px', minWidth: '300px' }}>
          <div style={{ position: 'relative', width: '100%', height: 400 }}>
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  className="product-details-image"
                  src={product.images[activeImage] ? (product.images[activeImage].startsWith('/uploads/') ? `http://localhost:5000${product.images[activeImage]}` : product.images[activeImage]) : '/no-image.png'}
                  alt={product.name}
                  style={{ width: '100%', height: '400px', objectFit: 'contain', background: '#fff', borderRadius: '12px', boxShadow: `0 8px 24px ${currentTheme.shadow}`, border: `1px solid ${currentTheme.border}` }}
                  onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith('/uploads/') ? `http://localhost:5000${img}` : img}
                      alt={`thumb-${idx}`}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: activeImage === idx ? `2px solid ${currentTheme.primary}` : '1px solid #ccc', cursor: 'pointer', opacity: activeImage === idx ? 1 : 0.7 }}
                      onClick={() => setActiveImage(idx)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                <img
                  className="product-details-image"
                  src={product.image ? (product.image.startsWith('/uploads/') ? `http://localhost:5000${product.image}` : product.image) : '/no-image.png'}
                  alt={product.name}
                  style={{ width: '100%', height: '400px', objectFit: 'contain', background: '#fff', borderRadius: '12px', boxShadow: `0 8px 24px ${currentTheme.shadow}`, border: `1px solid ${currentTheme.border}` }}
                  onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
                />
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                  <FaShareAlt style={{ fontSize: 22, color: currentTheme.primary, cursor: 'pointer' }} title="Share" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')} />
                  <FaFacebook style={{ fontSize: 22, color: '#1877f3', cursor: 'pointer' }} title="Share on Facebook" onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} />
                  <FaWhatsapp style={{ fontSize: 22, color: '#25d366', cursor: 'pointer' }} title="Share on WhatsApp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank')} />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Info */}
        <div className="product-info-container" style={{ flex: '1 1 300px', maxWidth: '500px', minWidth: '300px' }}>
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
            {company && (
              <span style={{ fontSize: 16, color: currentTheme.textSecondary, marginLeft: 12, fontWeight: 500 }}>
                by {company.name}
              </span>
            )}
            {product.inStock === false && (
              <span style={{ color: '#e53935', fontWeight: 600, marginLeft: 12 }}><FaCheckCircle style={{ marginRight: 4 }} />Out of Stock</span>
            )}
            {product.inStock !== false && (
              <span style={{ color: '#43a047', fontWeight: 600, marginLeft: 12 }}><FaCheckCircle style={{ marginRight: 4 }} />In Stock</span>
            )}
          </h2>
          {/* Delivery Info */}
          <div style={{ marginBottom: 18, color: currentTheme.textSecondary }}>
            <FaTruck style={{ marginRight: 6 }} />Estimated delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} (3 days)
          </div>
          {/* GST, HSN, Brand */}
          <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
            {company && <span style={{ color: currentTheme.primary, fontWeight: 500 }}>Brand: {company.name}</span>}
            {product.gst && <span style={{ color: currentTheme.textSecondary }}>GST: {product.gst}%</span>}
            {product.hsnCode && <span style={{ color: currentTheme.textSecondary }}>HSN: {product.hsnCode}</span>}
          </div>
          
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
              <ul style={{ paddingLeft: 18, color: currentTheme.textSecondary, fontSize: 16, lineHeight: '1.7', margin: 0 }}>
                {product.details.split(/\r?\n|,/).map((f, idx) => f.trim() && (
                  <li key={idx} style={{ marginBottom: 6, display: 'flex', alignItems: 'center' }}>
                    <FaCheckCircle style={{ marginRight: 8, color: currentTheme.primary }} />{f.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Reviews */}
          <div style={{ background: currentTheme.surface, padding: '20px', borderRadius: '12px', marginBottom: '24px', border: `1px solid ${currentTheme.border}` }}>
            <h3 style={{ color: currentTheme.text, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Customer Reviews</h3>
            {reviews.length === 0 ? (
              <div style={{ color: currentTheme.textSecondary }}>No reviews yet.</div>
            ) : (
              reviews.map((r, idx) => (
                <div key={idx} style={{ marginBottom: 14, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                  <span style={{ fontWeight: 600, color: currentTheme.primary }}>{r.user}</span>
                  <span style={{ marginLeft: 10, color: '#fbc02d', fontWeight: 700 }}>
                    {[...Array(5)].map((_, i) => i < r.rating ? <FaStar key={i} /> : <FaRegStar key={i} />)}
                  </span>
                  <div style={{ color: currentTheme.textSecondary, marginTop: 4 }}>{r.comment}</div>
                </div>
              ))
            )}
            {/* Review Submission */}
            <div style={{ marginTop: 18 }}>
              <input
                type="text"
                value={reviewInput.user}
                onChange={e => setReviewInput({ ...reviewInput, user: e.target.value })}
                placeholder="Your name"
                style={{ padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginRight: 8, fontSize: 15 }}
              />
              <select
                value={reviewInput.rating}
                onChange={e => setReviewInput({ ...reviewInput, rating: Number(e.target.value) })}
                style={{ padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginRight: 8, fontSize: 15 }}
              >
                <option value={0}>Rating</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <input
                type="text"
                value={reviewInput.comment}
                onChange={e => setReviewInput({ ...reviewInput, comment: e.target.value })}
                placeholder="Your review"
                style={{ padding: '8px', borderRadius: 6, border: '1px solid #ccc', marginRight: 8, fontSize: 15, width: 180 }}
              />
              <button
                onClick={() => {
                  if (reviewInput.user && reviewInput.rating && reviewInput.comment) {
                    setReviews([...reviews, { ...reviewInput }]);
                    setReviewInput({ user: '', rating: 0, comment: '' });
                  } else {
                    toast.error('Please fill all review fields');
                  }
                }}
                style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: currentTheme.primary, color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >Submit Review</button>
            </div>
          </div>
          {/* Related Products */}
          <div style={{ background: currentTheme.surface, padding: '20px', borderRadius: '12px', marginBottom: '24px', border: `1px solid ${currentTheme.border}` }}>
            <h3 style={{ color: currentTheme.text, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Related Products</h3>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              {related.map(r => (
                <div key={r._id} style={{ width: 180, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 10, textAlign: 'center', cursor: 'pointer', border: '1px solid #eee' }} onClick={() => window.location.href = `/customer/products/${r._id}`}>
                  <img src={r.image} alt={r.name} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ fontWeight: 600, color: currentTheme.primary }}>{r.name}</div>
                  <div style={{ color: currentTheme.textSecondary, fontSize: 15 }}>₹{r.price}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Reviews */}
          <div style={{ background: currentTheme.surface, padding: '20px', borderRadius: '12px', marginBottom: '24px', border: `1px solid ${currentTheme.border}` }}>
            <h3 style={{ color: currentTheme.text, fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Customer Reviews</h3>
            {reviews.length === 0 ? (
              <div style={{ color: currentTheme.textSecondary }}>No reviews yet.</div>
            ) : (
              reviews.map((r, idx) => (
                <div key={idx} style={{ marginBottom: 14, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                  <span style={{ fontWeight: 600, color: currentTheme.primary }}>{r.user}</span>
                  <span style={{ marginLeft: 10, color: '#fbc02d', fontWeight: 700 }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                  <div style={{ color: currentTheme.textSecondary, marginTop: 4 }}>{r.comment}</div>
                </div>
              ))
            )}
          </div>
          
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
              transition: 'all 0.2s ease',
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
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
