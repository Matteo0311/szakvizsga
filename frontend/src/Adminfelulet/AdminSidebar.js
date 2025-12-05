import React from 'react';
import { FaHome, FaCog, FaSignOutAlt, FaArrowLeft, FaGlobe, FaFutbol } from 'react-icons/fa';
import './AdminSidebarStyles.css';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <div 
        className={`admin-sidebar-icon ${isActive('/adminfelulet') ? 'active' : ''}`}
        title="Főoldal" 
        onClick={() => navigate('/adminfelulet')}
      >
        <FaHome />
      </div>
      
      <div 
        className={`admin-sidebar-icon ${isActive('/orszagmodosit') ? 'active' : ''}`}
        title="Országok kezelése" 
        onClick={() => navigate('/orszagmodosit')}
      >
        <FaGlobe />
      </div>
      
      <div 
        className={`admin-sidebar-icon ${isActive('/focijatekmodosit') ? 'active' : ''}`}
        title="Focikezelő" 
        onClick={() => navigate('/focijatekmodosit')}
      >
        <FaFutbol />
      </div>
      
      {user?.szerepkor === 'admin' && (
        <div 
          className={`admin-sidebar-icon ${isActive('/beallitasok') ? 'active' : ''}`}
          title="Beállítások" 
          onClick={() => navigate('/beallitasok')}
        >
          <FaCog />
        </div>
      )}
      
      <div style={{ flex: 1 }} />
      
      <div 
        className="admin-sidebar-icon" 
        title="Kijelentkezés" 
        onClick={handleLogout} 
        style={{marginBottom: 24, cursor: 'pointer', background: '#222', color: '#fff'}}
      >
        <FaSignOutAlt />
      </div>
      
      <div 
        className="admin-sidebar-icon" 
        title="Vissza a főoldalra" 
        onClick={() => navigate('/')} 
        style={{marginBottom: 24, cursor: 'pointer', background: '#222', color: '#fff'}}
      >
        <FaArrowLeft />
      </div>
    </div>
  );
};

export default AdminSidebar;
