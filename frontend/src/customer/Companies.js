import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get('/companies');
        setCompanies(res.data);
      } catch {
        toast.error('Failed to load companies.');
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#00695c' }}>Companies</h2>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search companies..."
        style={{
          margin: '16px auto',
          display: 'block',
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          fontSize: 16,
          width: '100%',
          maxWidth: 400
        }}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '40px',
        marginTop: '40px',
        alignItems: 'start',
      }}>
          {(companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))).map(company => {
          let imageUrl = company.image;
          if (imageUrl && imageUrl.startsWith('/uploads/')) {
            imageUrl = `http://localhost:5000${imageUrl}`;
          }
          if (!imageUrl) {
            imageUrl = 'https://via.placeholder.com/420x220?text=No+Image';
          }
          return (
            <div
              key={company._id}
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
              onClick={() => navigate(`/customer/companies/${company._id}`)}
            >
              <img
                src={imageUrl}
                alt={company.name}
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
              }}>{company.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Companies;
