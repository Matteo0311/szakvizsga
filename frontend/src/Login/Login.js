import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginStyles.css';

const Login = () => {
  const [felh_nev, setFelh_nev] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ahonnan jöttek, oda irányítsuk vissza sikeres bejelentkezés után
  const from = location.state?.from?.pathname || '/adminfelulet';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(felh_nev, jelszo);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape login-shape-1"></div>
        <div className="login-shape login-shape-2"></div>
        <div className="login-shape login-shape-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <span>🔐</span>
          </div>
          <h1>Adminisztrátori bejelentkezés</h1>
          <p>Adja meg a bejelentkezési adatait</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
              value={felh_nev}
              onChange={(e) => setFelh_nev(e.target.value)}
              required
              disabled={loading}
              placeholder="Adja meg a felhasználónevét"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jelszo">Jelszó</label>
            <input
              type="password"
              id="jelszo"
              value={jelszo}
              onChange={(e) => setJelszo(e.target.value)}
              required
              disabled={loading}
              placeholder="Adja meg a jelszavát"
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Bejelentkezés...
              </>
            ) : (
              <>
                <span>Bejelentkezés</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Még nincs fiókja? 
            <button 
              type="button" 
              className="link-btn" 
              onClick={() => navigate('/register')}
            >
              Regisztráció
            </button>
          </p>
          <p>Csak adminisztrátorok számára</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
