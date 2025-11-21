import React from 'react';
import { Link } from 'react-router-dom';
import './AdminStyles.css';

const Adminfelulet = () => {
    return (
        <div className="admin-container">
            <div className="admin-hero">
                <div className="admin-hero-content">
                    <div className="admin-icon">
                        <span>👨‍💼</span>
                    </div>
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
                            <Link to="/OrszagModosit" className="admin-btn admin-btn-primary">
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
                            <h3>Foci játékok</h3>
                            <p>Sporteseményadatok és meccseredmények kezelése</p>
                            <div className="card-features">
                                <span className="feature-badge">Meccsek</span>
                                <span className="feature-badge">Eredmények</span>
                                <span className="feature-badge">Csapatok</span>
                                <span className="feature-badge">Statisztika</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/FociJatekModosit" className="admin-btn admin-btn-secondary">
                                <span>Megnyitás</span>
                                <span className="btn-arrow">→</span>
                            </Link>
                        </div>
                        <div className="card-glow"></div>
                    </div>

                    <div className="admin-card-modern admin-card-inactive">
                        <div className="card-icon inactive">
                            <span>⚙️</span>
                        </div>
                        <div className="card-content">
                            <h3>Beállítások</h3>
                            <p>Rendszerbeállítások és konfigurációs opciók</p>
                            <div className="card-features">
                                <span className="feature-badge inactive">Felhasználók</span>
                                <span className="feature-badge inactive">Jogosultságok</span>
                                <span className="feature-badge inactive">Konfiguráció</span>
                                <span className="feature-badge inactive">Biztonság</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="admin-btn admin-btn-disabled">
                                <span>Hamarosan</span>
                                <span className="btn-lock">🔒</span>
                            </div>
                        </div>
                        <div className="card-overlay">
                            <div className="overlay-text">
                                <span className="coming-soon">Fejlesztés alatt</span>
                            </div>
                        </div>
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