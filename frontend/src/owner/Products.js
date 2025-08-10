import React, { useEffect, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { createPortal } from 'react-dom';
import API from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
// Helper to crop image
function getCroppedImg(imageSrc, croppedAreaPixels, zoom, aspect = 1) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = reject;
  });
}

const Products = () => {
  const { currentTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', price: '', offer: '', companyId: '', image: '', description: '', imagePreview: ''
  });
  const [companies, setCompanies] = useState([]);
  const [editId, setEditId] = useState(null);
  // For cropping modal
  const [cropModal, setCropModal] = useState({ open: false, src: '', file: null });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  // Get companyId from query param
  const query = new URLSearchParams(location.search);
  const companyIdFilter = query.get('companyId') || '';

  const fetchProducts = useCallback(async () => {
    let url = '/products';
    if (companyIdFilter) {
      url = `/products/company/${companyIdFilter}`;
    }
    const res = await API.get(url);
    setProducts(res.data);
  }, [companyIdFilter]);

  const fetchCompanies = useCallback(async () => {
    const res = await API.get('/companies');
    setCompanies(res.data);
  }, []);

  const handleAdd = async () => {
    // Validate required fields
    if (!form.name || !form.price || !form.companyId) {
      toast.error('Please fill in Name, Price, and select a Company.');
      return;
    }
    try {
      // Ensure price and offer are numbers
      const payload = {
        ...form,
        price: Number(form.price),
        offer: form.offer ? Number(form.offer) : 0
      };
      if (editId) {
        await API.put(`/products/${editId}`, payload);
      } else {
        await API.post('/products', payload);
      }
      setForm({ name: '', price: '', offer: '', companyId: '', image: '', description: '', imagePreview: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error('Failed to save product: ' + err.response.data.message);
      } else if (err.response && err.response.data) {
        toast.error('Failed to save product: ' + JSON.stringify(err.response.data));
      } else {
        toast.error('Failed to save product.');
      }
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      offer: product.offer,
      companyId: product.companyId?._id || product.companyId,
      image: product.image,
      description: product.description || '',
      imagePreview: ''
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCompanies();
  }, [fetchProducts, fetchCompanies]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      toast.error('Error deleting product.');
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .products-form-container {
            flex-direction: column;
            gap: 12px;
          }
          .products-form-container input,
          .products-form-container select,
          .products-form-container button {
            width: 100% !important;
            margin-right: 0 !important;
          }
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 16px !important;
          }
          .product-card {
            padding: 16px !important;
          }
        }
        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .product-card {
            padding: 12px !important;
          }
          .product-card h4 {
            font-size: 16px !important;
          }
        }
      `}</style>
      
      <div style={{ 
        padding: '30px 20px', 
        background: currentTheme.background,
        color: currentTheme.text,
        minHeight: 'calc(100vh - 56px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          color: currentTheme.text,
          marginBottom: '24px',
          fontSize: '28px',
          fontWeight: '700',
          textAlign: 'center'
        }}>
          Manage Products
        </h2>
        {/* Search Bar */}
        <div style={{ maxWidth: 400, margin: '0 auto 24px auto', textAlign: 'center' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products by name..."
            style={{ padding: '12px', width: '100%', borderRadius: 8, border: `1px solid ${currentTheme.primary}`, fontSize: 16 }}
          />
        </div>
        {companyIdFilter && (
          <div style={{ 
            marginBottom: '20px',
            padding: '16px',
            background: currentTheme.surface,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`
          }}>
            <span style={{ 
              marginRight: '16px',
              color: currentTheme.text,
              fontSize: '16px'
            }}>
              Showing products for: <b style={{ color: currentTheme.primary }}>{companies.find(c => c._id === companyIdFilter)?.name || 'Selected Company'}</b>
            </span>
            <button 
              onClick={() => navigate('/owner/products')} 
              style={{ 
                padding: '8px 16px', 
                background: currentTheme.button, 
                color: currentTheme.buttonText, 
                border: 'none', 
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Clear Filter
            </button>
          </div>
        )}
        
        <div 
          className="products-form-container"
          style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '30px',
            padding: '24px',
            background: currentTheme.surface,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`
          }}
        >
          <input 
            placeholder="Name" 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            style={{ 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.background,
              color: currentTheme.text,
              fontSize: '14px',
              minWidth: '200px',
              flex: '1 1 200px'
            }} 
          />
          <input 
            placeholder="GST (%)" 
            type="number" 
            value={form.gst || ''} 
            onChange={e => setForm({ ...form, gst: e.target.value })} 
            required
            style={{ 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.background,
              color: currentTheme.text,
              fontSize: '14px',
              width: '100px',
              flex: '0 0 100px'
            }} 
          />
          <input 
            placeholder="HSN Code" 
            value={form.hsnCode || ''} 
            onChange={e => setForm({ ...form, hsnCode: e.target.value })} 
            required
            style={{ 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.background,
              color: currentTheme.text,
              fontSize: '14px',
              width: '120px',
              flex: '0 0 120px'
            }} 
          />
          <input 
            placeholder="Price" 
            type="number" 
            value={form.price} 
            onChange={(e) => setForm({ ...form, price: e.target.value })} 
            style={{ 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.background,
              color: currentTheme.text,
              fontSize: '14px',
              width: '120px',
              flex: '0 0 120px'
            }} 
          />
          <input 
            placeholder="Offer (%)" 
            type="number" 
            value={form.offer} 
            onChange={(e) => setForm({ ...form, offer: e.target.value })} 
            style={{ 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.background,
              color: currentTheme.text,
              fontSize: '14px',
              width: '100px',
              flex: '0 0 100px'
            }} 
          />
          {/* Removed Image URL input, only file upload is shown */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              // Remove imageFileName, just set preview
              const reader = new FileReader();
              reader.onload = (ev) => {
                setCropModal({ open: true, src: ev.target.result, file });
                setForm(f => ({ ...f, imagePreview: ev.target.result }));
              };
              reader.readAsDataURL(file);
            }} 
            style={{ 
              padding: '8px', 
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.background,
              color: currentTheme.text,
              fontSize: '14px',
              minWidth: '200px',
              flex: '1 1 200px'
            }} 
          />
          {form.imagePreview && (
            <img 
              src={form.imagePreview} 
              alt="Selected" 
              style={{ marginLeft: 12, width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: `1px solid ${currentTheme.border}` }} 
            />
          )}
      {/* Cropper Modal */}
      {cropModal.open && createPortal(
        <div style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 340, minHeight: 420, boxShadow: '0 4px 32px #2222', position: 'relative' }}>
            <h3 style={{ margin: 0, marginBottom: 12, color: '#1565c0', fontWeight: 800 }}>Adjust Image</h3>
            {/* File size display */}
            {cropModal.file && (
              <div style={{ marginBottom: 10, fontSize: 15, color: cropModal.file.size > 10 * 1024 * 1024 ? '#e53935' : '#333', fontWeight: 600 }}>
                File size: {(cropModal.file.size / 1024 / 1024) > 1
                  ? (cropModal.file.size / 1024 / 1024).toFixed(2) + ' MB'
                  : (cropModal.file.size / 1024).toFixed(1) + ' KB'}
                {cropModal.file.size > 10 * 1024 * 1024 && (
                  <span style={{ color: '#e53935', marginLeft: 8 }}>
                    (File too large! Max 10MB allowed)
                  </span>
                )}
              </div>
            )}
            <div style={{ position: 'relative', width: 320, height: 320, background: '#eee', borderRadius: 10, overflow: 'hidden', marginBottom: 18 }}>
              <Cropper
                image={cropModal.src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <span style={{ fontSize: 15 }}>Zoom:</span>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} />
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => setCropModal({ open: false, src: '', file: null })} style={{ padding: '8px 18px', background: '#bdbdbd', color: '#333', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={async () => {
                // Upload full image without cropping
                if (!cropModal.file) return;
                if (cropModal.file.size > 10 * 1024 * 1024) {
                  toast.error('File too large! Max 10MB allowed.');
                  return;
                }
                const formData = new FormData();
                formData.append('image', cropModal.file);
                try {
                  const res = await API.post('/products/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  setForm(f => ({ ...f, image: res.data.imageUrl, imagePreview: cropModal.src }));
                  setCropModal({ open: false, src: '', file: null });
                } catch {
                  toast.error('Image upload failed.');
                }
              }} style={{ padding: '8px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Use Full Image</button>
              <button onClick={async () => {
                // Crop and upload
                if (!croppedAreaPixels || !cropModal.src) return;
                if (cropModal.file && cropModal.file.size > 10 * 1024 * 1024) {
                  toast.error('File too large! Max 10MB allowed.');
                  return;
                }
                const croppedBlob = await getCroppedImg(cropModal.src, croppedAreaPixels, zoom);
                const formData = new FormData();
                formData.append('image', new File([croppedBlob], cropModal.file.name, { type: 'image/jpeg' }));
                try {
                  const res = await API.post('/products/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  setForm(f => ({ ...f, image: res.data.imageUrl, imagePreview: cropModal.src }));
                  setCropModal({ open: false, src: '', file: null });
                } catch {
                  toast.error('Image upload failed.');
                }
              }} style={{ padding: '8px 18px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save Cropped</button>
            </div>
          </div>
        </div>,
        document.body
      )}
          {/* Removed image preview, only file input is shown */}
          <select 
            value={form.companyId} 
            onChange={(e) => setForm({ ...form, companyId: e.target.value })} 
            style={{ 
              padding: '12px', 
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.background,
              color: currentTheme.text,
              fontSize: '14px',
              minWidth: '180px',
              flex: '1 1 180px'
            }}
          >
            <option value="">Select Company</option>
            {companies.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <button 
            onClick={handleAdd} 
            style={{ 
              padding: '12px 24px', 
              background: editId ? '#fbc02d' : currentTheme.button, 
              color: editId ? '#333' : currentTheme.buttonText, 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              minWidth: '140px',
              flex: '0 0 140px',
              boxShadow: `0 2px 8px ${currentTheme.shadow}`
            }}
          >
            {editId ? 'Update Product' : 'Add'}
          </button>
          {editId && (
            <button 
              onClick={() => { 
                setEditId(null); 
                setForm({ name: '', price: '', offer: '', companyId: '', image: '', description: '', imagePreview: '' }); 
              }}
              style={{ 
                padding: '12px 24px', 
                background: currentTheme.surface, 
                color: currentTheme.text, 
                border: `1px solid ${currentTheme.border}`, 
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                minWidth: '100px',
                flex: '0 0 100px'
              }}
            >
              Cancel
            </button>
          )}
          {/* Discounted price display */}
          {form.price && form.offer && !isNaN(Number(form.price)) && !isNaN(Number(form.offer)) && (
            <div style={{ 
              color: currentTheme.primary, 
              fontWeight: '600',
              fontSize: '16px',
              padding: '8px 12px',
              background: currentTheme.surface,
              borderRadius: '6px',
              border: `1px solid ${currentTheme.border}`,
              flex: '1 1 200px'
            }}>
              Price after offer: ₹{(Number(form.price) * (1 - Number(form.offer) / 100)).toFixed(2)}
            </div>
          )}
        </div>
        
        <div 
          className="products-grid"
          style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => {
            const hasOffer = p.offer && !isNaN(Number(p.offer)) && Number(p.offer) > 0;
            const price = Number(p.price);
            const offer = Number(p.offer) || 0;
            const discounted = hasOffer ? (price * (1 - offer / 100)) : price;
            return (
              <div 
                key={p._id} 
                className="product-card"
                style={{ 
                  border: `1px solid ${currentTheme.border}`, 
                  borderRadius: '12px', 
                  padding: '20px', 
                  position: 'relative', 
                  background: currentTheme.surface,
                  boxShadow: `0 4px 12px ${currentTheme.shadow}`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${currentTheme.shadow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.shadow}`;
                }}
              >
                {(() => {
                  let imgSrc = p.image;
                  if (imgSrc && imgSrc.startsWith('/uploads/')) {
                    imgSrc = 'http://localhost:5000' + imgSrc;
                  }
                  return (
                    <img 
                      src={imgSrc} 
                      alt={p.name} 
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '8px', 
                        marginBottom: '16px',
                        border: `1px solid ${currentTheme.border}`
                      }} 
                    />
                  );
                })()}
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  fontWeight: '700',
                  fontSize: '18px',
                  color: currentTheme.text,
                  lineHeight: '1.3'
                }}>
                  {p.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  {hasOffer && (
                    <span style={{ 
                      color: '#e53935', 
                      fontWeight: '700', 
                      fontSize: '16px', 
                      marginRight: '8px',
                      background: '#ffebee',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      -{offer}%
                    </span>
                  )}
                  <span style={{ 
                    fontWeight: '700', 
                    fontSize: '24px', 
                    color: currentTheme.primary, 
                    marginRight: '8px' 
                  }}>
                    ₹{discounted.toLocaleString('en-IN')}
                  </span>
                </div>
                {hasOffer && (
                  <div style={{ 
                    color: currentTheme.textSecondary, 
                    fontSize: '14px', 
                    marginBottom: '12px' 
                  }}>
                    M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{price.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <p style={{ 
                  fontSize: '14px', 
                  minHeight: '40px',
                  color: currentTheme.textSecondary,
                  lineHeight: '1.4',
                  marginBottom: '16px'
                }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', gap: 16, position: 'absolute', top: 16, right: 16 }}>
                  <button 
                    onClick={() => handleEdit(p)} 
                    style={{ 
                      background: '#fbc02d', 
                      color: '#333', 
                      border: 'none', 
                      borderRadius: '6px', 
                      padding: '6px 16px', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    style={{ 
                      background: '#e53935', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '6px', 
                      padding: '6px 16px', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Products;
