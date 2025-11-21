// Modern Navbar komponens
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './NavbarStyles.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <span className="brand-icon">🎮</span>
          HigherLower
        </Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Főoldal
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/temavalasztas') ? 'active' : ''}`} 
                to="/temavalasztas"
                onClick={() => setIsMenuOpen(false)}
              >
                🎯 Témaválasztás
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/adminfelulet') ? 'active' : ''}`} 
                to="/adminfelulet"
                onClick={() => setIsMenuOpen(false)}
              >
                👨‍💼 Adminfelület
              </Link>
            </li>
          </ul>
          
          <div className="navbar-actions">
            {isAuthenticated && (
              <div className="user-info">
                <span className="user-welcome">👋 {user?.nev}</span>
                <button className="logout-btn" onClick={handleLogout} title="Kijelentkezés">
                  🚪 Kilépés
                </button>
              </div>
            )}
            <button className="theme-toggle" onClick={toggleTheme} title={isDarkTheme ? 'Világos témára váltás' : 'Sötét témára váltás'}>
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
