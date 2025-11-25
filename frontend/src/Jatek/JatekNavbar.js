// Játék Navbar komponens
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './JatekNavbarStyles.css';

const JatekNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

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
    <nav className="jatek-navbar">
      <div className="jatek-navbar-container">
        <Link className="jatek-navbar-brand" to="/">
          <span className="jatek-brand-icon">🎮</span>
          HigherLower
        </Link>
        
        <div className={`jatek-navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="jatek-navbar-nav">
            <li className="jatek-nav-item">
              <Link 
                className={`jatek-nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Főoldal
              </Link>
            </li>
            <li className="jatek-nav-item">
              <Link 
                className={`jatek-nav-link ${isActive('/temavalasztas') ? 'active' : ''}`} 
                to="/temavalasztas"
                onClick={() => setIsMenuOpen(false)}
              >
                🎯 Játék
              </Link>
            </li>
            <li className="jatek-nav-item">
              <Link 
                className={`jatek-nav-link ${(isActive('/adminfelulet') || isActive('/login')) ? 'active' : ''}`} 
                to={isAuthenticated ? "/adminfelulet" : "/login"}
                onClick={() => setIsMenuOpen(false)}
              >
                👨‍💼 Admin
              </Link>
            </li>
          </ul>
          
          <div className="jatek-navbar-actions">
            <button className="jatek-theme-toggle" onClick={toggleTheme} title={isDarkTheme ? 'Világos témára váltás' : 'Sötét témára váltás'}>
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        <button className="jatek-mobile-menu-toggle" onClick={toggleMenu}>
          <span className={`jatek-hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default JatekNavbar;
