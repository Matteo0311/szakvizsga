import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '10vh' }}>
      <h1>404 - Az oldal nem található</h1>
      <button
        style={{ padding: '10px 20px', fontSize: '18px', marginTop: '20px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Vissza a főoldalra
      </button>
    </div>
  );
};

export default NotFound;
