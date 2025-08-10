import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const OffersManager = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

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

  const [editOffer, setEditOffer] = useState({});
  const [editingId, setEditingId] = useState(null);

  return (
    <div style={{ padding: '32px 20px', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24, color: '#1565c0', textAlign: 'center', width: '100%' }}>Offer Manager</h2>
      {/* Search Bar */}
      <div style={{ maxWidth: 400, margin: '0 auto 24px auto', textAlign: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products by name..."
          style={{ padding: '12px', width: '100%', borderRadius: 8, border: '1px solid #1565c0', fontSize: 16 }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18, width: '100%' }}>
        {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => {
          let imgSrc = p.image;
          if (imgSrc && imgSrc.startsWith('/uploads/')) {
            imgSrc = 'http://localhost:5000' + imgSrc;
          }
          // Calculate discounted price and MRP
          const offerValue = editingId === p._id ? (editOffer[p._id] ?? p.offer ?? 0) : (p.offer ?? 0);
          const mrp = p.price;
          const discountedPrice = mrp - (mrp * offerValue / 100);
          return (
            <div key={p._id} style={{
              display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #ddd', padding: '18px', gap: 24, position: 'relative'
            }}>
              <img src={imgSrc || 'https://via.placeholder.com/80x80?text=No+Image'} alt={p.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#eee' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#222', marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: '#1976d2', fontWeight: 600, fontSize: 18 }}>₹{discountedPrice.toFixed(0)} <span style={{ color: '#888', textDecoration: 'line-through', fontSize: 15, marginLeft: 8 }}>₹{mrp}</span></div>
                <div style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Current Offer: <b style={{ color: '#e53935' }}>{offerValue}%</b></div>
              </div>
              {editingId === p._id ? (
                <>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editOffer[p._id] ?? p.offer ?? ''}
                    onChange={e => setEditOffer({ ...editOffer, [p._id]: e.target.value })}
                    style={{ padding: '8px', width: 80, borderRadius: 6, border: '1px solid #bbb', fontSize: 15, marginRight: 10 }}
                  />
                  <button
                    onClick={async () => {
                      await updateOffer(p._id, editOffer[p._id]);
                      setEditingId(null);
                    }}
                    style={{ padding: '8px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, marginRight: 8, cursor: 'pointer' }}
                  >Update</button>
                  <button
                    onClick={() => { setEditingId(null); setEditOffer({ ...editOffer, [p._id]: p.offer }); }}
                    style={{ padding: '8px 16px', background: '#bdbdbd', color: '#333', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                  >Cancel</button>
                </>
              ) : (
                <button
                  onClick={() => { setEditingId(p._id); setEditOffer({ ...editOffer, [p._id]: p.offer }); }}
                  style={{ padding: '8px 18px', background: '#fbc02d', color: '#333', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                >Edit Offer</button>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .offer-row { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default OffersManager;
