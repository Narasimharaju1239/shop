import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password updated successfully!');
      navigate('/');
    } catch {
      toast.error('Reset failed.');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: '#fff3e0'
    }}>
      <form onSubmit={handleSubmit} style={{
        padding: '30px', background: '#fff', borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '90%', maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center' }}>Reset Password</h2>
        <input type="password" placeholder="New Password" required
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" style={{
          width: '100%', padding: '10px', background: '#f57c00',
          color: '#fff', border: 'none', cursor: 'pointer'
        }}>Reset</button>
      </form>
    </div>
  );
};

export default ResetPassword;
