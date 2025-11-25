import React from 'react';
import { Link } from 'react-router-dom';
import './AdminStyles.css';

const Adminfelulet = () => {
    return (
        <div className="admin-container">
            <div className="admin-hero">
                <div className="admin-hero-content">
                    <h1 className="admin-title">Adminisztráció</h1>
                    <p className="admin-subtitle">Teljes körű rendszerkezelés és adatszerkesztés</p>
                </div>
                <div className="admin-hero-bg">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-shape hero-shape-3"></div>
                </div>
            </div>

            <div className="admin-main">
                <div className="admin-grid-modern">
                    <div className="admin-card-modern admin-card-active">
                        <div className="card-icon">
                            <span>🌍</span>
                        </div>
                        <div className="card-content">
                            <h3>Országok kezelése</h3>
                            <p>Teljes ország adatbázis adminisztráció és menedzsment</p>
                            <div className="card-features">
                                <span className="feature-badge">Hozzáadás</span>
                                <span className="feature-badge">Módosítás</span>
                                <span className="feature-badge">Keresés</span>
                                <span className="feature-badge">Listázás</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/orszagmodosit" className="admin-btn admin-btn-primary">
                                <span>Megnyitás</span>
                                <span className="btn-arrow">→</span>
                            </Link>
                        </div>
                        <div className="card-glow"></div>
                    </div>

                    <div className="admin-card-modern admin-card-active">
                        <div className="card-icon">
                            <span>⚽</span>
                        </div>
                        <div className="card-content">
                            <h3>Focikezelő</h3>
                            <p>Foci játékosok adatainak kezelése</p>
                            <div className="card-features">
                                <span className="feature-badge">Hozzáadás</span>
                                <span className="feature-badge">Módosítás</span>
                                <span className="feature-badge">Keresés</span>
                                <span className="feature-badge">Listázás</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/focijatekmodosit" className="admin-btn admin-btn-primary">
                                <span>Megnyitás</span>
                                <span className="btn-arrow">→</span>
                            </Link>
                        </div>
                        <div className="card-glow"></div>
                    </div>

                    <div className="admin-card-modern admin-card-active">
                        <div className="card-icon">
                            <span>⚙️</span>
                        </div>
                        <div className="card-content">
                            <h3>Beállítások</h3>
                            <p>Rendszerbeállítások és konfigurációs opciók</p>
                            <div className="card-features">
                                <span className="feature-badge">Regisztráció</span>
                                <span className="feature-badge">Jogosultságok</span>
                                <span className="feature-badge">Konfiguráció</span>
                                <span className="feature-badge">Biztonság</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/beallitasok" className="admin-btn admin-btn-primary">
                                <span>Megnyitás</span>
                                <span className="btn-arrow">→</span>
                            </Link>
                        </div>
                        <div className="card-glow"></div>
                    </div>
                </div>

                <div className="admin-actions">
                    <Link to="/" className="back-button">
                        <span className="back-icon">←</span>
                        <span>Vissza a főoldalra</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Adminfelulet;