// Felhasználói bejelentkezés komponens
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import config from '../../config';
import './AuthUnifiedStyles.css';

const UserLogin = () => {
  const [felh_nev, setFelhNev] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ felh_nev, jelszo })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Hibás felhasználónév vagy jelszó.');
        setLoading(false);
        return;
      }
      loginWithToken(data.token, data.szerepkor);
      navigate('/user/profile');
    } catch (err) {
      setError('Hálózati hiba.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">👤</div>
          <div className="auth-title">Bejelentkezés</div>
          <div className="auth-desc">Lépj be a fiókodba</div>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" className="auth-form">
          <div className="form-group">
            <label htmlFor="felh_nev">Felhasználónév</label>
            <input type="text" id="felh_nev" placeholder="Felhasználónév" value={felh_nev} onChange={e => setFelhNev(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="jelszo">Jelszó</label>
            <input type="password" id="jelszo" placeholder="Jelszó" value={jelszo} onChange={e => setJelszo(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Bejelentkezés...' : 'Bejelentkezés'}</button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <div className="auth-footer">Nincs még fiókod? <button className="auth-link" onClick={() => navigate('/user/register')}>Regisztráció</button></div>
      </div>
    </div>
  );
};

export default UserLogin;
