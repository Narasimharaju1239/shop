import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Cropper from 'react-easy-crop';
// Helper to generate default avatar URL from first letter of name or username
const getDefaultAvatar = (name, username) => {
  let initial = 'U';
  if (name && name.trim().length > 0) initial = name.trim()[0];
  else if (username && username.trim().length > 0) initial = username.trim()[0];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=ddd&color=555&rounded=true&size=128`;
};

const API_BASE = 'http://localhost:5000';

const Profile = () => {
  const { user } = useContext(AuthContext);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.image || getDefaultAvatar(user?.name, user?.username));

  // Track if user intentionally removed existing avatar
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  // Image cropper
  const [showCrop, setShowCrop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null); // track blob URLs to revoke later

  // -------- Fetch Profile on mount --------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.token;
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/users/profile`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setName(data?.name || '');
          setEmail(data?.email || '');
          setMobile(data?.phone || '');
          setAvatar(data?.image ? `${API_BASE}${data.image}` : getDefaultAvatar(data?.name, data?.username));
          setAvatarRemoved(false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  // Cleanup any blob URLs we create
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  // -------- Image helpers --------
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.addEventListener('load', () => resolve(img));
      img.addEventListener('error', (err) => reject(err));
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          const blobUrl = URL.createObjectURL(blob);
          resolve({ blob, blobUrl });
        },
        'image/jpeg',
        0.95
      );
    });
  };

  // -------- Handlers --------
  const onEditClick = () => {
  setShowAvatarMenu(true);
  };

  const onCropComplete = (_area, areaPixels) => setCroppedAreaPixels(areaPixels);

  const handleCropSave = async () => {
    try {
      if (!selectedImage || !croppedAreaPixels) return;

  const { blobUrl } = await getCroppedImg(selectedImage, croppedAreaPixels);

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = blobUrl;

      setAvatar(blobUrl);
      setAvatarRemoved(false); // user selected a new image, no need to remove old on backend separately
      setShowCrop(false);
      setSelectedImage(null);
    } catch (err) {
      console.error('Crop error:', err);
      alert('Could not crop the image. Please try again.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData?.token;

      // 1) If avatar is a blob URL, upload it
      if (avatar && avatar.startsWith('blob:')) {
        const formData = new FormData();
        const response = await fetch(avatar);
        const blob = await response.blob();
        formData.append('avatar', blob, 'avatar.jpg');

        const uploadRes = await fetch(`${API_BASE}/api/users/upload-avatar`, {
          method: 'POST',
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: 'include',
        });

        if (!uploadRes.ok) {
          alert('Failed to upload avatar');
          return;
        }
      }

      // 2) If user removed avatar and did NOT upload a new one, tell backend to remove
      // Adjust body field to match your backend (e.g., removeAvatar: true)
      const body = {
        name,
        email,
        phone: mobile,
        removeAvatar: avatarRemoved && !avatar.startsWith('blob:'),
      };

      const profileRes = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (profileRes.ok) {
        alert('Profile changes saved!');
      } else {
        alert('Failed to save profile changes');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving profile changes');
    }
  };

  // -------- UI --------
  return (
    <div
      style={{
        maxWidth: 500,
        margin: '40px auto',
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        background: '#fff',
      }}
    >
      {/* Avatar + Edit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <div style={{ position: 'relative' }}>
          <img
            src={avatar}
            alt="avatar"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #ccc',
            }}
          />
          <button
            onClick={onEditClick}
            title="Edit profile picture"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#fff',
              borderRadius: '50%',
              border: '1px solid #ccc',
              padding: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M4 20h4.586a1 1 0 0 0 .707-.293l10.414-10.414a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0L4.293 14.707A1 1 0 0 0 4 15.414V20z"
                stroke="#007bff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 6.5l4 4"
                stroke="#007bff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {showAvatarMenu && (
            <div style={{
              position: 'absolute',
              bottom: 40,
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: 8,
              zIndex: 1000,
              minWidth: 120
            }}>
              <button
                style={{
                  width: '100%',
                  padding: '8px 0',
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: 6,
                  marginBottom: 4
                }}
                onClick={() => {
                  setAvatar(getDefaultAvatar(name, user?.username));
                  setAvatarRemoved(true);
                  setSelectedImage(null);
                  setShowCrop(false);
                  setShowAvatarMenu(false);
                  if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                    objectUrlRef.current = null;
                  }
                  // Call backend to remove avatar
                  const userData = JSON.parse(localStorage.getItem('user'));
                  const token = userData?.token;
                  fetch(`${API_BASE}/api/users/remove-avatar`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                  });
                }}
              >Remove Photo</button>
              <button
                style={{
                  width: '100%',
                  padding: '8px 0',
                  background: 'none',
                  border: 'none',
                  color: '#333',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderRadius: 6
                }}
                onClick={() => {
                  setShowAvatarMenu(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                    fileInputRef.current.click();
                  }
                }}
              >Change Photo</button>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.addEventListener('load', () => {
                    setSelectedImage(reader.result);
                    setShowCrop(true);
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                  });
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{name || 'Your name'}</div>
          {user?.username && <div style={{ color: '#777' }}>@{user.username}</div>}
          <div style={{ color: '#555', marginTop: 4 }}>{email || 'yourname@gmail.com'}</div>
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {/* Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {[
          {
            label: 'Name',
            value: name,
            setter: setName,
            type: 'text',
            placeholder: 'Your name',
            readOnly: false,
          },
          {
            label: 'Email account',
            value: email,
            setter: setEmail,
            type: 'email',
            placeholder: 'yourname@gmail.com',
            readOnly: true,
          },
          {
            label: 'Mobile number',
            value: mobile,
            setter: setMobile,
            type: 'text',
            placeholder: 'Add number',
            readOnly: false,
          },
        ].map((field, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontWeight: 500 }}>{field.label}</label>
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              autoComplete="off"
              readOnly={field.readOnly}
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#007bff')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            borderRadius: 6,
            border: 'none',
            background: '#007bff',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            marginTop: 10,
          }}
        >
          Save Changes
        </button>
      </form>

      {/* Crop Modal */}
      {showCrop && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 20,
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 15,
              width: '90%',
              maxWidth: 400,
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: 300 }}>
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
              />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setShowCrop(false);
                  setSelectedImage(null);
                }}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  background: '#f8f9fa',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#28a745',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Crop &amp; Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
