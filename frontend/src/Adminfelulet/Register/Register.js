import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import './RegisterStyles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    felh_nev: '',
    jelszo: '',
    jelszo_confirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Regisztráció állapot ellenőrzése
    const savedRegistration = localStorage.getItem('registrationEnabled');
    if (savedRegistration !== null) {
      setRegistrationEnabled(JSON.parse(savedRegistration));
    }
  }, []);

  // Ha a regisztráció le van tiltva, visszairányítás
  if (!registrationEnabled) {
    return (
      <div className="register-container">
        <div className="register-background">
          <div className="register-shape register-shape-1"></div>
          <div className="register-shape register-shape-2"></div>
        </div>
        
        <div className="register-card">
          <div className="register-header">
            <div className="register-icon">
              <span>🚫</span>
            </div>
            <h1>Regisztráció letiltva</h1>
            <p>A regisztráció jelenleg nem elérhető</p>
          </div>
          
          <div className="register-footer">
            <p>
              Vissza a bejelentkezéshez: 
              <button 
                type="button" 
                className="link-btn" 
                onClick={() => navigate('/login')}
              >
                Bejelentkezés
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

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

    // Jelszó ellenőrzés
    if (formData.jelszo !== formData.jelszo_confirm) {
      setError('A jelszavak nem egyeznek!');
      setLoading(false);
      return;
    }

    if (formData.jelszo.length < 4) {
      setError('A jelszónak legalább 4 karakter hosszúnak kell lennie!');
      setLoading(false);
      return;
    }

    try {
      console.log('Regisztrációs kísérlet:', `${config.API_BASE_URL}/register`);
      
      const response = await fetch(`${config.API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          felh_nev: formData.felh_nev,
          jelszo: formData.jelszo
        }),
      });

      console.log('Válasz státusz:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Sikeres válasz:', data);
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('Hiba adatok:', errorData);
        setError(errorData.error || errorData.message || `HTTP hiba: ${response.status}`);
      }
    } catch (error) {
      console.error('Regisztráció hiba:', error);
      setError(`Hálózati hiba: ${error.message}`);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-background">
          <div className="register-shape register-shape-1"></div>
          <div className="register-shape register-shape-2"></div>
        </div>
        
        <div className="register-card success-card">
          <div className="success-icon">✅</div>
          <h1>Sikeres regisztráció!</h1>
          <p>Átirányítás a bejelentkezési oldalra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-shape register-shape-1"></div>
        <div className="register-shape register-shape-2"></div>
        <div className="register-shape register-shape-3"></div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">
            <span>👤</span>
          </div>
          <h1>Új fiók regisztrálása</h1>
          <p>Hozz létre egy adminisztrátori fiókot</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
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
            <label htmlFor="jelszo">Jelszó</label>
            <input
              type="password"
              id="jelszo"
              name="jelszo"
              value={formData.jelszo}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Adja meg a jelszavát"
              minLength="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jelszo_confirm">Jelszó megerősítése</label>
            <input
              type="password"
              id="jelszo_confirm"
              name="jelszo_confirm"
              value={formData.jelszo_confirm}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Erősítse meg a jelszavát"
              minLength="4"
            />
          </div>

          <button 
            type="submit" 
            className="register-btn"
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

        <div className="register-footer">
          <p>
            Már van fiókja? 
            <button 
              type="button" 
              className="link-btn" 
              onClick={() => navigate('/login')}
            >
              Bejelentkezés
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
