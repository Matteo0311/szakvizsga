import React from 'react';
import { FaUser, FaChartBar, FaCog, FaSignOutAlt, FaEdit } from './UserProfileIcons';
import './UserSidebarStyles.css';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const UserSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <div className="user-sidebar">
      <div className="user-sidebar-icon active" title="Profil"><FaUser /></div>
      <div className="user-sidebar-icon" title="Statisztika"><FaChartBar /></div>
      <div className="user-sidebar-icon" title="Beállítások"><FaCog /></div>
      <div className="user-sidebar-icon" title="Adatmódosítás" onClick={() => navigate('/user/adatmodositas')}><FaEdit /></div>
      <div style={{ flex: 1 }} />
      <div className="user-sidebar-icon" title="Kijelentkezés" onClick={handleLogout} style={{marginBottom: 24, cursor: 'pointer', background: '#222', color: '#fff'}}>
        <FaSignOutAlt />
      </div>
    </div>
  );
};

export default UserSidebar;
