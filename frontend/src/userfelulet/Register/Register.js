// Felhasználói regisztráció komponens
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import './AuthUnifiedStyles.css';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    felh_nev: '',
    email: '',
    jelszo1: '',
    jelszo2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Érvénytelen e-mail cím!');
      setLoading(false);
      return;
    }
    if (formData.jelszo1 !== formData.jelszo2) {
      setError('A jelszavak nem egyeznek!');
      setLoading(false);
      return;
    }
    if (formData.jelszo1.length < 4) {
      setError('A jelszónak legalább 4 karakter hosszúnak kell lennie!');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${config.API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          felh_nev: formData.felh_nev,
          email: formData.email,
          jelszo1: formData.jelszo1,
          jelszo2: formData.jelszo2
        })
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/user/login');
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || errorData.message || `HTTP hiba: ${response.status}`);
      }
    } catch (error) {
      setError(`Hálózati hiba: ${error.message}`);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="user-auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">✅</div>
            <div className="auth-title">Sikeres regisztráció!</div>
            <div className="auth-desc">Átirányítás a bejelentkezési oldalra...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">👤</div>
          <div className="auth-title">Új fiók regisztrálása</div>
          <div className="auth-desc">Hozz létre egy felhasználói fiókot</div>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="felh_nev">Felhasználónév</label>
            <input
              type="text"
              id="felh_nev"
              name="felh_nev"
              value={formData.felh_nev}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Adja meg a felhasználónevét"
              minLength="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail cím</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="pelda@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="jelszo1">Jelszó</label>
            <input
              type="password"
              id="jelszo1"
              name="jelszo1"
              value={formData.jelszo1}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Adja meg a jelszavát"
              minLength="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="jelszo2">Jelszó megerősítése</label>
            <input
              type="password"
              id="jelszo2"
              name="jelszo2"
              value={formData.jelszo2}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Erősítse meg a jelszavát"
              minLength="4"
            />
          </div>
          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Regisztráció...
              </>
            ) : (
              <>
                <span>Regisztráció</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Már van fiókod? 
            <button 
              type="button" 
              className="auth-link" 
              onClick={() => navigate('/user/login')}
            >
              Bejelentkezés
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
