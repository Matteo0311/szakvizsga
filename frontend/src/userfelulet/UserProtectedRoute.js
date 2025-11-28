import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
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
    // Átirányítás a user login oldalra, de megjegyezzük, hogy honnan jöttek
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return children;
};

export default UserProtectedRoute;
