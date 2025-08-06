import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const OffersManager = () => {
  const [products, setProducts] = useState([]);

  const updateOffer = async (id, newOffer) => {
    try {
      await API.put(`/products/${id}`, { offer: newOffer });
      toast.success('Offer updated');
      fetchProducts();
    } catch {
      toast.error('Failed to update offer.');
    }
  };

  const fetchProducts = async () => {
    const res = await API.get('/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Update Product Offers</h2>
      {products.map(p => (
        <div key={p._id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px', borderBottom: '1px solid #ccc'
        }}>
          <span>{p.name} - ₹{p.price}</span>
          <input
            type="number"
            placeholder="New Offer %"
            onBlur={(e) => updateOffer(p._id, e.target.value)}
            style={{ padding: '5px', width: '100px' }}
          />
        </div>
      ))}
    </div>
  );
};

export default OffersManager;
