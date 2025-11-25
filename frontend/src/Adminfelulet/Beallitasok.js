import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BeallitasokStyles.css';

const Beallitasok = () => {
    const [registrationEnabled, setRegistrationEnabled] = useState(true);

    useEffect(() => {
        // Regisztráció állapot betöltése
        const savedRegistration = localStorage.getItem('registrationEnabled');
        if (savedRegistration !== null) {
            setRegistrationEnabled(JSON.parse(savedRegistration));
        }
    }, []);

    const toggleRegistration = () => {
        const newState = !registrationEnabled;
        setRegistrationEnabled(newState);
        localStorage.setItem('registrationEnabled', JSON.stringify(newState));
    };

    return (
        <div className="settings-container">
            <div className="settings-hero">
                <div className="settings-hero-content">
                    <h1 className="settings-title">Beállítások</h1>
                    <p className="settings-subtitle">Rendszerbeállítások és konfigurációs opciók kezelése</p>
                </div>
            </div>

            <div className="settings-main">
                <div className="settings-grid">
                    
                    {/* Regisztráció kezelése */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">
                                <span>👤</span>
                            </div>
                            <div className="settings-card-title">
                                <h3>Regisztráció kezelése</h3>
                                <p>Új felhasználók regisztrációjának engedélyezése vagy tiltása</p>
                            </div>
                        </div>
                        
                        <div className="settings-card-content">
                            <div className="settings-toggle-container">
                                <label className="settings-toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={registrationEnabled} 
                                        onChange={toggleRegistration}
                                    />
                                    <span className="toggle-slider"></span>
                                    <span className="toggle-label">
                                        Regisztráció {registrationEnabled ? 'engedélyezve' : 'letiltva'}
                                    </span>
                                </label>
                                
                                <p className="settings-description">
                                    {registrationEnabled 
                                        ? '✅ Az új felhasználók regisztrálhatnak adminisztrátori fiókot a /register oldalon.' 
                                        : '❌ A regisztráció jelenleg le van tiltva. A /register oldal nem érhető el.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Felhasználói jogosultságok - Hamarosan */}
                    <div className="settings-card settings-card-disabled">
                        <div className="settings-card-header">
                            <div className="settings-card-icon disabled">
                                <span>🔐</span>
                            </div>
                            <div className="settings-card-title">
                                <h3>Felhasználói jogosultságok</h3>
                                <p>Adminisztrátori jogkörök és engedélyek kezelése</p>
                            </div>
                        </div>
                        
                        <div className="settings-card-content">
                            <div className="coming-soon-badge">
                                <span>🚧 Fejlesztés alatt</span>
                            </div>
                        </div>
                    </div>

                    {/* Rendszer konfigurációja - Hamarosan */}
                    <div className="settings-card settings-card-disabled">
                        <div className="settings-card-header">
                            <div className="settings-card-icon disabled">
                                <span>⚙️</span>
                            </div>
                            <div className="settings-card-title">
                                <h3>Rendszer konfiguráció</h3>
                                <p>Alapvető rendszerbeállítások és paraméterek</p>
                            </div>
                        </div>
                        
                        <div className="settings-card-content">
                            <div className="coming-soon-badge">
                                <span>🚧 Fejlesztés alatt</span>
                            </div>
                        </div>
                    </div>

                    {/* Biztonsági beállítások - Hamarosan */}
                    <div className="settings-card settings-card-disabled">
                        <div className="settings-card-header">
                            <div className="settings-card-icon disabled">
                                <span>🛡️</span>
                            </div>
                            <div className="settings-card-title">
                                <h3>Biztonsági beállítások</h3>
                                <p>Jelszó szabályok, munkamenet kezelés, audit log</p>
                            </div>
                        </div>
                        
                        <div className="settings-card-content">
                            <div className="coming-soon-badge">
                                <span>🚧 Fejlesztés alatt</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Navigáció */}
                <div className="settings-actions">
                    <Link to="/adminfelulet" className="back-button">
                        <span className="back-icon">←</span>
                        <span>Vissza az adminfelületre</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Beallitasok;
