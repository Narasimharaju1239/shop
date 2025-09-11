import React, { useEffect, useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import getCroppedImg from '../utils/cropImage';
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
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rawImage, setRawImage] = useState(null);
  const [aspect, setAspect] = useState(1); // Default 1:1
  const [fullImageAspect, setFullImageAspect] = useState(null); // For 'Full Image' option
  const [minZoom, setMinZoom] = useState(1);
  // Calculate minZoom to fit full image in crop area
  const calculateMinZoom = useCallback((img, aspect) => {
    if (!img) return 1;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const cropWidth = aspect >= 1 ? 320 : 320 * aspect; // modal crop area width
    const cropHeight = aspect >= 1 ? 320 / aspect : 320; // modal crop area height
    const zoomW = cropWidth / width;
    const zoomH = cropHeight / height;
    return Math.max(zoomW, zoomH, 1);
  }, []);

  // When image or aspect changes, set minZoom and zoom
  useEffect(() => {
    if (!rawImage) return;
    const img = new window.Image();
    img.src = rawImage;
    img.onload = () => {
      if (aspect === 'full') {
        const naturalAspect = img.naturalWidth / img.naturalHeight;
        setFullImageAspect(naturalAspect);
        const minZ = calculateMinZoom(img, naturalAspect);
        setMinZoom(minZ);
        setZoom(minZ);
      } else {
        setFullImageAspect(null);
        const minZ = calculateMinZoom(img, aspect);
        setMinZoom(minZ);
        setZoom(minZ);
      }
    };
  }, [rawImage, aspect, calculateMinZoom]);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(ev.target.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    setUploading(true);
    try {
      let cropToUse = croppedAreaPixels;
      if (aspect === 'full' && rawImage) {
        // Get the full image dimensions
        const img = new window.Image();
        img.src = rawImage;
        await new Promise(res => { img.onload = res; });
        cropToUse = { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight };
      }
      const croppedBlob = await getCroppedImg(rawImage, cropToUse);
      setImagePreview(URL.createObjectURL(croppedBlob));
      const formData = new FormData();
      formData.append('image', croppedBlob, 'cropped-image.jpg');
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

  const handleChangePhoto = () => {
    setCropModalOpen(false);
    setRawImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
  <Modal
        isOpen={cropModalOpen}
        onRequestClose={() => setCropModalOpen(false)}
        style={{
          overlay: { zIndex: 1000, background: 'rgba(0,0,0,0.7)' },
          content: {
            maxWidth: 500,
            width: '90%',
            margin: 'auto',
            borderRadius: 16,
            padding: 0,
            border: 'none',
            background: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }
        }}
        ariaHideApp={false}
      >
        <div style={{ padding: 24, paddingBottom: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 24, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Crop Your Image</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 18 }}>
            {[
              { label: '16:9', value: 16/9 },
              { label: '4:3', value: 4/3 },
              { label: '1:1', value: 1 },
              { label: 'Full', value: 'full' }
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => setAspect(opt.value)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: (aspect === opt.value || (aspect === 'full' && opt.value === 'full')) ? '#1976d2' : '#f4f4f4',
                  color: (aspect === opt.value || (aspect === 'full' && opt.value === 'full')) ? '#fff' : '#333',
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: (aspect === opt.value || (aspect === 'full' && opt.value === 'full')) ? '0 2px 8px #1976d233' : 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  borderBottom: (aspect === opt.value || (aspect === 'full' && opt.value === 'full')) ? '2px solid #1976d2' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >{opt.label}</button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '100%', height: 220, background: '#eee', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            {rawImage && (
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                aspect={aspect === 'full' && fullImageAspect ? fullImageAspect : aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="rect"
                showGrid={false}
              />
            )}
          </div>
          <div style={{ margin: '0 0 18px 0', textAlign: 'center', fontWeight: 500, fontSize: 18 }}>Preview</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc', background: '#fff' }} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
            <input
              type="range"
              min={minZoom}
              max={3}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              style={{ width: '80%' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, padding: '0 0 24px 0' }}>
          <button onClick={handleChangePhoto} style={{ padding: '10px 24px', background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 8, fontWeight: 600, fontSize: 16, marginRight: 8, cursor: 'pointer' }}>Change photo</button>
          <button onClick={handleCropSave} style={{ padding: '10px 32px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>Crop & Save</button>
        </div>
      </Modal>

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
          // If imageUrl is a local upload, convert to absolute URL
          if (imageUrl && imageUrl.startsWith('/uploads/')) {
            imageUrl = `http://localhost:5000${imageUrl}`;
          }
          // If imageUrl is missing or empty, use a local fallback image
          if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
            imageUrl = '/no-image.png';
          }
          return (
            <div
              key={c._id}
              style={{
                width: '100%',
                maxWidth: '540px',
                background: 'transparent',
                borderRadius: '20px',
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 0,
                margin: 0,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  background: '#fff',
                  borderRadius: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'block',
                }}
                onClick={() => navigate(`/owner/products?companyId=${c._id}`)}
              >
                <img
                  src={imageUrl}
                  alt={c.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '20px' }}
                  onError={e => { e.target.onerror = null; e.target.src = '/no-image.png'; }}
                />
                <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '12px', zIndex: 2 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleEdit(c)} style={{ padding: '8px 18px', background: '#fbc02d', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  <button onClick={() => handleDelete(c._id)} style={{ padding: '8px 18px', background: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                </div>
              </div>
              <div style={{
                width: '100%',
                background: '#555',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.5rem',
                textAlign: 'center',
                padding: '16px 0 14px 0',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                letterSpacing: 1,
                boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                textShadow: '1px 1px 2px #222',
                marginTop: 0,
              }}>
                {c.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Companies;
