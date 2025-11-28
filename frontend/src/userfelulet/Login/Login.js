// Felhasználói bejelentkezés komponens
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import config from '../../config';
import './LoginStyles.css';

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
    <div className="user-login-container modern-form">
      <h2>Bejelentkezés</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="input-group">
          <input type="text" placeholder="Felhasználónév" value={felh_nev} onChange={e => setFelhNev(e.target.value)} required />
        </div>
        <div className="input-group">
          <input type="password" placeholder="Jelszó" value={jelszo} onChange={e => setJelszo(e.target.value)} required />
        </div>
        <button type="submit" className="modern-btn" disabled={loading}>{loading ? 'Bejelentkezés...' : 'Bejelentkezés'}</button>
        {error && <div className="error-message">{error}</div>}
      </form>
      <div className="form-footer">Nincs még fiókod? <span className="form-link" onClick={() => navigate('/user/register')}>Regisztráció</span></div>
    </div>
  );
};

export default UserLogin;
