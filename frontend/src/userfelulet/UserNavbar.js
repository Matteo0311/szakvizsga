import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const UserNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <nav style={{ background: '#1976d2', padding: '1rem', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/user/profile" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>Profil</Link>
      </div>
      <div>
        <span style={{ marginRight: 16 }}>{user?.nev}</span>
        <button onClick={handleLogout} style={{ background: '#fff', color: '#1976d2', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>Kijelentkezés</button>
      </div>
            <div>
        <span style={{ marginRight: 16 }}>{user?.nev}</span>
        <button onClick={handleLogout} style={{ background: '#fff', color: '#1976d2', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold' }}>Vissza a főoldalra</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
