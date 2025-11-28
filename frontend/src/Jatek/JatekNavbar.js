// Játék Navbar komponens
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './JatekNavbarStyles.css';

const JatekNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

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
    <nav className={`jatek-navbar${isDarkTheme ? ' dark' : ' light'}`}>
      <div className="jatek-navbar-container">
        <Link className="jatek-navbar-brand" to="/">
          HigherLower
        </Link>
        <div className={`jatek-navbar-menu${isMenuOpen ? ' active' : ''}`}>  
          <ul className="jatek-navbar-nav">
            <li className="jatek-nav-item">
              <Link 
                className={`jatek-nav-link${isActive('/') ? ' active' : ''}`} 
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Főoldal
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="jatek-nav-item">
                  <Link 
                    className={`jatek-nav-link${isActive('/profile') ? ' active' : ''}`} 
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Fiókkezelés
                  </Link>
                </li>
                <li className="jatek-nav-item">
                  <button 
                    className="jatek-nav-link logout-btn"
                    onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}
                  >
                    Kijelentkezés
                  </button>
                </li>
              </>
            ) : (
              <li className="jatek-nav-item auth-dropdown-wrapper" onMouseEnter={() => setAuthDropdownOpen(true)} onMouseLeave={() => setAuthDropdownOpen(false)}>
                <button className="jatek-nav-link auth-dropdown-btn" onClick={() => setAuthDropdownOpen(v => !v)} aria-haspopup="true" aria-expanded={authDropdownOpen}>
                  Fiók
                  <span className="dropdown-caret">▼</span>
                </button>
                {authDropdownOpen && (
                  <div className="auth-dropdown-menu">
                    <Link className="dropdown-link" to="/user/login" onClick={() => { setAuthDropdownOpen(false); setIsMenuOpen(false); }}>Bejelentkezés</Link>
                    <Link className="dropdown-link register" to="/user/register" onClick={() => { setAuthDropdownOpen(false); setIsMenuOpen(false); }}>Regisztráció</Link>
                  </div>
                )}
              </li>
            )}
          </ul>
          <div className="jatek-navbar-actions">
            <button className="jatek-theme-toggle2" onClick={toggleTheme} title={isDarkTheme ? 'Világos témára váltás' : 'Sötét témára váltás'}>
              <span className="theme-toggle-icon">
                {isDarkTheme ? (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="7" fill="#fff" stroke="#222" strokeWidth="2" />
                    <g><path d="M11 2v2M11 18v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M2 11h2M18 11h2M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></g>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.657 16.243A8 8 0 0 1 5.757 4.343 7 7 0 1 0 17.657 16.243Z" fill="#222" stroke="#fff" strokeWidth="2"/>
                    <g><path d="M11 2v2M11 18v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M2 11h2M18 11h2M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></g>
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
        <button className="jatek-mobile-menu-toggle" onClick={toggleMenu}>
          <span className={`jatek-hamburger${isMenuOpen ? ' active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default JatekNavbar;
