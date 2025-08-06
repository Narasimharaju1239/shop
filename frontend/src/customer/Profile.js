import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div style={{ padding: 20, color: 'red', fontWeight: 600 }}>User not found. Please log in again.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
    </div>
  );
};

export default Profile;
