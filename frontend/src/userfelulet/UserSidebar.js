import React from 'react';
import { FaUser, FaChartBar, FaCog, FaSignOutAlt, IoArrowBackCircleSharp, FaCrown } from './UserProfileIcons';
import './UserSidebarStyles.css';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const UserSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  const handleAdminAccess = () => {
    // Védelmi ellenőrzés: csak admin felhasználók
    if (user && user.szerepkor === 'admin') {
      navigate('/adminfelulet');
    } else {
      // Ha valaki módosítja a kódot és próbál belépni, ne tudjon semmit csinálni
      console.warn('Unauthorized access attempt to admin panel');
    }
  };

  // Admin status ellenőrzése
  const isAdmin = user && user.szerepkor === 'admin';

  // DEBUG: Logoljuk az user objektumot
  console.log('User object:', user);
  console.log('isAdmin value:', isAdmin);
  console.log('user.szerepkor:', user?.szerepkor);

  return (
    <div className="user-sidebar">
      <div className="user-sidebar-icon active" title="Profil" onClick={() => navigate('/user/profile')}><FaUser /></div>
      <div className="user-sidebar-icon" title="Statisztika"><FaChartBar inactive/></div>
      <div className="user-sidebar-icon" title="Beállítások" onClick={() => navigate('/user/adatmodositas')}><FaCog /></div>
      <div style={{ flex: 1 }} />
      
      {/* Admin gomb - csak adminoknak látható */}
      {isAdmin && (
        <div 
          className="user-sidebar-icon" 
          title="Belépés az adminfelületbe" 
          onClick={handleAdminAccess} 
          style={{marginBottom: 24, cursor: 'pointer', background: '#222', color: 'yellow', border: '1px solid yellow'}}
        >
          <FaCrown />
        </div>
      )}
      
      <div className="user-sidebar-icon" title="Kijelentkezés" onClick={handleLogout} style={{marginBottom: 24, cursor: 'pointer', background: '#222', color: '#fff'}}>
        <FaSignOutAlt />
      </div>
      <div className="user-sidebar-icon" title="Vissza a főoldalra" onClick={() => navigate('/')} style={{marginBottom: 24, cursor: 'pointer', background: '#222', color: '#fff'}}>
        <IoArrowBackCircleSharp />
      </div>
    </div>
  );
};

export default UserSidebar;
