// Modern Navbar komponens
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavbarStyles.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const location = useLocation();

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
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle">
                ⚙️ Admin
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    className={`dropdown-link ${isActive('/adminfelulet') ? 'active' : ''}`} 
                    to="/adminfelulet"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👨‍💼 Adminfelület
                  </Link>
                </li>
                <li>
                  <Link 
                    className={`dropdown-link ${isActive('/orszagmodosit') ? 'active' : ''}`} 
                    to="/orszagmodosit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🌍 Ország módosítás
                  </Link>
                </li>
                <li>
                  <Link 
                    className={`dropdown-link ${isActive('/focijatekmodosit') ? 'active' : ''}`} 
                    to="/focijatekmodosit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ⚽ Focijáték módosítás
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          
          <button className="theme-toggle" onClick={toggleTheme} title={isDarkTheme ? 'Világos témára váltás' : 'Sötét témára váltás'}>
            {isDarkTheme ? '☀️' : '🌙'}
          </button>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
