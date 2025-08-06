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

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Products</h2>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px', marginTop: '20px'
      }}>
        {products.map(p => {
          // Debug: log the image URL being used
          let imageUrl;
          if (p.image && typeof p.image === 'string' && p.image.startsWith('/uploads/')) {
            imageUrl = `http://localhost:5000${p.image}`;
          } else if (p.image && typeof p.image === 'string' && p.image.trim() !== '') {
            imageUrl = p.image;
          } else {
            imageUrl = '/no-image.png';
          }
          return (
            <div key={p._id} style={{
              border: '1px solid #ccc', borderRadius: '10px', padding: '15px',
              textAlign: 'center', background: '#fff'
            }}>
              <img
                src={imageUrl}
                alt={p.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
              />
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
