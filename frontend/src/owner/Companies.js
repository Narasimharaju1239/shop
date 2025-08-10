import React, { useEffect, useState, useRef } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


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
    try {
      if (editId) {
        await API.put(`/companies/${editId}`, { name, image });
      } else {
        await API.post('/companies', { name, image });
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
    // Show preview before upload
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await API.post('/companies/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(res.data.imageUrl);
    } catch {
      toast.error('Image upload failed.');
    }
    setUploading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '40px',
          marginTop: '40px',
          alignItems: 'start',
        }}
      >
        {companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => {
          let imageUrl = c.image;
          if (imageUrl && imageUrl.startsWith('/uploads/')) {
            imageUrl = `http://localhost:5000${imageUrl}`;
          }
          if (!imageUrl) {
            imageUrl = 'https://via.placeholder.com/420x220?text=No+Image';
          }
          return (
            <div
              key={c._id}
              style={{
                width: '100%',
                maxWidth: '540px',
                minHeight: '300px',
                background: '#222',
                borderRadius: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={() => navigate(`/owner/products?companyId=${c._id}`)}
            >
              <img
                src={imageUrl}
                alt={c.name}
                style={{ width: '100%', height: '220px', objectFit: 'cover', background: '#eee' }}
                onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/420x220?text=No+Image'; }}
              />
              <span style={{
                marginTop: 18,
                color: '#fff',
                textShadow: '1px 1px 2px #000',
                fontWeight: 'bold',
                fontSize: '1.6rem',
                alignSelf: 'center',
              }}>{c.name}</span>
              <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '12px' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => handleEdit(c)} style={{ padding: '8px 18px', background: '#fbc02d', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                <button onClick={() => handleDelete(c._id)} style={{ padding: '8px 18px', background: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Companies;
