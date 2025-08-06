import React, { useEffect, useState, useRef } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Companies = () => {
  const [companies, setCompanies] = useState([]);
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
      <h2>Manage Companies</h2>
      <input
        placeholder="Company Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <input
        placeholder="Image URL"
        value={image}
        onChange={(e) => { setImage(e.target.value); setImagePreview(''); }}
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ marginRight: '10px' }}
      />
      {/* Image preview for company upload */}
      {imagePreview && (
        <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #ccc', borderRadius: 6, marginRight: 10, verticalAlign: 'middle' }} />
      )}
      {uploading && <span>Uploading...</span>}
      <button onClick={handleAdd} style={{
        padding: '10px 20px', background: editId ? '#fbc02d' : '#1565c0', color: '#fff',
        border: 'none', marginRight: '10px'
      }}>{editId ? 'Update Company' : 'Add Company'}</button>
      {editId && (
        <button onClick={() => { setEditId(null); setName(''); setImage(''); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
          style={{ padding: '10px 20px', background: '#bdbdbd', color: '#333', border: 'none' }}>
          Cancel
        </button>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '40px',
          marginTop: '40px',
          alignItems: 'start',
        }}
      >
        {companies.map(c => {
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
