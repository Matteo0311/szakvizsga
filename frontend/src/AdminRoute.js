import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Betöltés...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Ha nincs bejelentkezve, átirányítás a login oldalra
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.szerepkor !== 'admin') {
    // Ha be van jelentkezve, de nem admin, átirányítás hibaüzenettel
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem' }}>🚫</div>
        <h1 style={{ color: '#e74c3c', margin: '0' }}>Hozzáférés megtagadva</h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem', maxWidth: '500px' }}>
          Ez az oldal csak adminisztrátorok számára érhető el. Jelenleg <strong>{user?.szerepkor || 'felhasználó'}</strong> szerepkörrel vagy bejelentkezve.
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          ← Vissza
        </button>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
