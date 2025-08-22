import React, { useEffect, useState, useRef } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/getCroppedImg';


const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  // Cropper states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rawImage, setRawImage] = useState(null);

  const handleEdit = (company) => {
    setEditId(company._id);
    setName(company.name);
    setImage(company.image || '');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await API.delete(`/companies/${id}`);
      fetchCompanies();
    } catch {
      toast.error('Error deleting company.');
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await API.get('/companies');
      setCompanies(res.data);
    } catch {
      toast.error('Failed to fetch companies.');
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error('Please provide company name.');
      return;
    }
    try {
      if (editId) {
        await API.put(`/companies/${editId}`, { name, image });
      } else {
        await API.post('/companies', image ? { name, image } : { name });
      }
      setEditId(null);
      setName('');
      setImage('');
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchCompanies();
    } catch {
      toast.error('Error saving company.');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Show crop modal with selected image
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(ev.target.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Called when cropping is done
  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Called when user confirms crop
  const handleCropSave = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels, zoom, 420/220); // 420x220 aspect
      setImagePreview(URL.createObjectURL(croppedBlob));
      // Upload cropped image
      const formData = new FormData();
      formData.append('image', croppedBlob, 'cropped.jpg');
      const res = await API.post('/companies/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(res.data.imageUrl);
      setCropModalOpen(false);
      setRawImage(null);
    } catch {
      toast.error('Image crop/upload failed.');
    }
    setUploading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* Crop Modal */}
      {cropModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 350, minHeight: 350, position: 'relative' }}>
            <h3 style={{ marginBottom: 16 }}>Crop Company Image</h3>
            <div style={{ position: 'relative', width: 350, height: 183, background: '#222' }}>
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={420/220}
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
              <label>Zoom:</label>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} />
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
              <button onClick={handleCropSave} style={{ padding: '10px 24px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>Crop & Upload</button>
              <button onClick={() => { setCropModalOpen(false); setRawImage(null); }} style={{ padding: '10px 24px', background: '#bdbdbd', color: '#333', border: 'none', borderRadius: 8, fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', color: '#1565c0', marginBottom: '18px', letterSpacing: 1 }}>Manage Companies</h2>
      {/* Search Bar */}
      <div style={{ maxWidth: 400, margin: '0 auto 24px auto', textAlign: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search companies by name..."
          style={{ padding: '12px', width: '100%', borderRadius: 8, border: '1px solid #1565c0', fontSize: 16 }}
        />
      </div>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto 32px auto',
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 4px 24px rgba(44,62,80,0.10)',
        padding: '24px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <input
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #1565c0', fontSize: '15px', minWidth: '220px', flex: '1 1 220px' }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ padding: '8px', borderRadius: '8px', border: '1px solid #1565c0', fontSize: '15px', minWidth: '180px', flex: '1 1 180px' }}
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 8, marginRight: 10, verticalAlign: 'middle' }} />
        )}
        {uploading && <span>Uploading...</span>}
        <button onClick={handleAdd} style={{
          padding: '12px 24px', background: editId ? '#fbc02d' : '#1565c0', color: '#fff',
          border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', minWidth: '140px', flex: '0 0 140px', boxShadow: '0 2px 8px #1565c033'
        }}>{editId ? 'Update Company' : 'Add Company'}</button>
        {editId && (
          <button onClick={() => { setEditId(null); setName(''); setImage(''); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            style={{ padding: '12px 24px', background: '#bdbdbd', color: '#333', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', minWidth: '100px', flex: '0 0 100px' }}>
            Cancel
          </button>
        )}
      </div>
        {companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => {
          let imageUrl = c.image;
          // Use relative URL in production, localhost in development
          if (imageUrl && imageUrl.startsWith('/uploads/')) {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              imageUrl = `http://localhost:5000${imageUrl}`;
            } else {
              imageUrl = `https://shop-backend.onrender.com${imageUrl}`; // <-- replace with your actual backend URL if different
            }
          }
          if (!imageUrl) {
            // Use a local SVG data URL as a placeholder
            imageUrl = 'data:image/svg+xml;utf8,<svg width=420 height=220 xmlns="http://www.w3.org/2000/svg"><rect width=420 height=220 fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="24">No Image</text></svg>';
          }
          return (
            <div
              key={c._id}
              style={{
                width: '100%',
                maxWidth: '540px',
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'block',
                marginBottom: '24px',
              }}
              onClick={() => navigate(`/owner/products?companyId=${c._id}`)}
            >
              <div style={{ width: '100%', height: '320px', position: 'relative' }}>
                <img
                  src={imageUrl}
                  alt={c.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#eee', display: 'block', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
                  onError={e => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg width=420 height=220 xmlns="http://www.w3.org/2000/svg"><rect width=420 height=220 fill="%23eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="24">No Image</text></svg>'; }}
                />
                <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '12px', zIndex: 2 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleEdit(c)} style={{ padding: '8px 18px', background: '#fbc02d', color: '#000000ff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  <button onClick={() => handleDelete(c._id)} style={{ padding: '8px 18px', background: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                </div>
              </div>
              {/* Company name below the image */}
              <div style={{
                width: '100%',
                background: '#000',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                textAlign: 'center',
                padding: '16px 0 14px 0',
                letterSpacing: 1,
                textShadow: '1px 1px 2px #000',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                marginTop: 0
              }}>{c.name}</div>
            </div>
          );
        })}
      </div>
  );
}

export default Companies;
