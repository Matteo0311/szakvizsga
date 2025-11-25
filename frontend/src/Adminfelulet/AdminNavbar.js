// Admin Navbar komponens
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './AdminNavbarStyles.css';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
    
    // Regisztráció állapot betöltése (csak a dropdown számára)
    const savedRegistration = localStorage.getItem('registrationEnabled');
    if (savedRegistration !== null) {
      setRegistrationEnabled(JSON.parse(savedRegistration));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Kattintás detektálás a dropdown bezárásához
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.admin-auth-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <Link className="admin-navbar-brand" to="/adminfelulet">
          <span className="admin-brand-icon">⚙️</span>
          Adminisztráció
        </Link>
        
        <div className={`admin-navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="admin-navbar-nav">
            {isAuthenticated ? (
              <li className="admin-nav-item">
                <Link 
                  className={`admin-nav-link ${isActive('/adminfelulet') ? 'active' : ''}`} 
                  to="/adminfelulet"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏠 Főoldal
                </Link>
              </li>
            ) : (
              <li className="admin-nav-item">
                <Link 
                  className={`admin-nav-link ${isActive('/') ? 'active' : ''}`} 
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🎮 Vissza a játékhoz
                </Link>
              </li>
            )}
          </ul>
          
          <div className="admin-navbar-actions">
            {isAuthenticated && (
              <div className="admin-user-info">
                <span className="admin-user-welcome">👋 {user?.nev}</span>
                <button className="admin-logout-btn" onClick={handleLogout} title="Kijelentkezés">
                  🚪 Kilépés
                </button>
              </div>
            )}
            {!isAuthenticated && (
              <div className="admin-auth-dropdown">
                <button className="admin-auth-toggle" onClick={toggleDropdown}>
                  🔐 Fiók
                </button>
                {isDropdownOpen && (
                  <div className="admin-dropdown-menu">
                    <Link to="/login" className="admin-dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                      🔑 Bejelentkezés
                    </Link>
                    {registrationEnabled && (
                      <Link to="/register" className="admin-dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                        📝 Regisztráció
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
            <button className="admin-theme-toggle" onClick={toggleTheme} title={isDarkTheme ? 'Világos témára váltás' : 'Sötét témára váltás'}>
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        <button className="admin-mobile-menu-toggle" onClick={toggleMenu}>
          <span className={`admin-hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
