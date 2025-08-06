
import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Cropper from 'react-easy-crop';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=ddd&color=555&rounded=true&size=128';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatar, setAvatar] = useState(user?.image || defaultAvatar);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  if (!user) {
    return <div style={{ padding: 20, color: 'red', fontWeight: 600 }}>User not found. Please log in again.</div>;
  }

  // Helper to get cropped image
  const getCroppedImg = async (imageSrc, cropPixels) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/jpeg');
    });
  };

  function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (err) => reject(err));
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedImage(reader.result);
        setShowCrop(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels);
    setAvatar(croppedImg);
    setShowCrop(false);
    setSelectedImage(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Save profile changes to backend
    alert('Profile changes saved!');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fb' }}>
      <div style={{
        width: 400,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: 32,
        position: 'relative',
        fontFamily: 'Inter, Arial, sans-serif',
      }}>
        {/* Close icon */}
        <button style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} title="Close">&times;</button>

        {/* Avatar + edit */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ position: 'relative', width: 70, height: 70 }}>
            <img src={avatar} alt="avatar" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3e3e3' }} />
            <button
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #e3e3e3',
                borderRadius: '50%',
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}
              onClick={() => fileInputRef.current.click()}
              title="Change profile picture"
            >
              <svg width="16" height="16" fill="#555" viewBox="0 0 24 24"><path d="M12 5.9c-3.37 0-6.1 2.73-6.1 6.1s2.73 6.1 6.1 6.1 6.1-2.73 6.1-6.1-2.73-6.1-6.1-6.1zm0 10.2c-2.26 0-4.1-1.84-4.1-4.1s1.84-4.1 4.1-4.1 4.1 1.84 4.1 4.1-1.84 4.1-4.1 4.1zm7.5-10.2h-2.2l-1.1-1.1c-.2-.2-.51-.2-.71 0l-1.1 1.1h-2.2c-.28 0-.5.22-.5.5v2.2c0 .28.22.5.5.5h2.2l1.1 1.1c.2.2.51.2.71 0l1.1-1.1h2.2c.28 0 .5-.22.5-.5v-2.2c0-.28-.22-.5-.5-.5z"/></svg>
              <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={onSelectFile} />
            </button>
          </div>
          <div style={{ marginLeft: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 20, color: '#222' }}>{name || 'Your name'}</span>
              {user?.username && (
                <span style={{ color: '#1976f7', fontSize: 15, fontWeight: 500, background: '#f0f6ff', borderRadius: 5, padding: '2px 8px' }}>@{user.username}</span>
              )}
            </div>
            <div style={{ color: '#888', fontSize: 15 }}>{email || 'yourname@gmail.com'}</div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '18px 0' }} />

        <form onSubmit={handleSave}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ flex: 1, color: '#888', fontSize: 15 }}>Name</div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ border: 'none', background: 'none', textAlign: 'right', color: '#222', fontWeight: 500, fontSize: 15, outline: 'none', width: 180 }}
              placeholder="your name"
              autoComplete="off"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ flex: 1, color: '#888', fontSize: 15 }}>Email account</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ border: 'none', background: 'none', textAlign: 'right', color: '#222', fontWeight: 500, fontSize: 15, outline: 'none', width: 180 }}
              placeholder="yourname@gmail.com"
              autoComplete="off"
              readOnly
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ flex: 1, color: '#888', fontSize: 15 }}>Mobile number</div>
            <input
              type="text"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              style={{ border: 'none', background: 'none', textAlign: 'right', color: '#222', fontWeight: 500, fontSize: 15, outline: 'none', width: 180 }}
              placeholder="Add number"
              autoComplete="off"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ flex: 1, color: '#888', fontSize: 15 }}>Location</div>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ border: 'none', background: 'none', textAlign: 'right', color: '#222', fontWeight: 500, fontSize: 15, outline: 'none', width: 180 }}
              placeholder="USA"
              autoComplete="off"
            />
          </div>
          <button type="submit" style={{
            width: '100%',
            background: '#1976f7',
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            fontWeight: 600,
            fontSize: 16,
            padding: '12px 0',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(25,118,247,0.08)'
          }}>Save Change</button>
        </form>

        {/* Crop modal */}
        {showCrop && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              width: 340,
              minHeight: 380,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            }}>
              <div style={{ width: 260, height: 260, background: '#222', borderRadius: '50%', overflow: 'hidden', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
                <div style={{ width: 260, height: 260, position: 'relative' }}>
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{ containerStyle: { width: 260, height: 260, background: '#222' } }}
                  />
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                style={{ width: 180, margin: '0 0 18px 0' }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowCrop(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 5, padding: '8px 18px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleCropSave} style={{ background: '#1976f7', color: '#fff', border: 'none', borderRadius: 5, padding: '8px 18px', fontWeight: 500, cursor: 'pointer' }}>Crop & Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
