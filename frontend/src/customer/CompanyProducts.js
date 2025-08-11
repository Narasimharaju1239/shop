import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CompanyProducts = () => {
  const { companyId } = useParams();
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
    // Carousel state for each product
    const [carouselIndexes, setCarouselIndexes] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get(`/products/company/${companyId}`);
        setProducts(res.data);
      } catch {
        toast.error('Error loading products.');
      }
    };
    fetchProducts();
  }, [companyId]);

    // Carousel auto-slide effect
    useEffect(() => {
      const interval = setInterval(() => {
        setCarouselIndexes(prev => {
          const updated = { ...prev };
          products.forEach(p => {
            if (p.images && p.images.length > 1) {
              updated[p._id] = ((prev[p._id] || 0) + 1) % p.images.length;
            }
          });
          return updated;
        });
      }, 3000); // 3 seconds
      return () => clearInterval(interval);
    }, [products]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Products</h2>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px', marginTop: '20px'
      }}>
        {products.map(p => {
          return (
            <div key={p._id} style={{
              border: '1px solid #ccc', borderRadius: '10px', padding: '15px',
              textAlign: 'center', background: '#fff'
            }}>
              {/* Image Carousel */}
              {p.images && Array.isArray(p.images) && p.images.length > 0 ? (
                <div style={{ position: 'relative', width: '100%', height: '150px', marginBottom: 8, overflow: 'hidden', borderRadius: '8px', background: '#fff' }}>
                  <img
                    src={p.images[(carouselIndexes[p._id] || 0)].startsWith('/uploads/') ? `http://localhost:5000${p.images[(carouselIndexes[p._id] || 0)]}` : p.images[(carouselIndexes[p._id] || 0)]}
                    alt={p.name}
                    style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '8px', background: '#fff' }}
                    onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
                  />
                  {/* Carousel dots */}
                  {p.images.length > 1 && (
                    <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                      {p.images.map((_, idx) => (
                        <span
                          key={idx}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: (carouselIndexes[p._id] || 0) === idx ? '#00796b' : '#ccc',
                            display: 'inline-block',
                            cursor: 'pointer',
                            border: '1px solid #fff'
                          }}
                          onClick={() => setCarouselIndexes(prev => ({ ...prev, [p._id]: idx }))}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={p.image && typeof p.image === 'string' && p.image.startsWith('/uploads/') ? `http://localhost:5000${p.image}` : (p.image && typeof p.image === 'string' && p.image.trim() !== '' ? p.image : '/no-image.png')}
                  alt={p.name}
                  style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '8px', background: '#fff' }}
                  onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
                />
              )}
              <h4>{p.name}</h4>
              {/* Discounted price block */}
              {p.offer ? (
                <div style={{ textAlign: 'left', marginLeft: '10px' }}>
                  <span style={{ color: '#e53935', fontWeight: 'bold', fontSize: '18px' }}>-{p.offer}% </span>
                  <span style={{ fontWeight: 'bold', fontSize: '22px' }}>₹{Math.round(p.price * (1 - p.offer / 100)).toLocaleString('en-IN')}</span><br />
                  <span style={{ color: '#888', fontSize: '16px' }}>M.R.P.: <span style={{ textDecoration: 'line-through', color: '#bbb' }}>₹{p.price.toLocaleString('en-IN')}</span></span>
                </div>
              ) : (
                <span style={{ fontWeight: 'bold', fontSize: '22px' }}>₹{p.price.toLocaleString('en-IN')}</span>
              )}
              <button onClick={() => addToCart(p)} style={{
                padding: '8px 16px', background: '#00796b', color: '#fff',
                border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px'
              }}>Add to Cart</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyProducts;
