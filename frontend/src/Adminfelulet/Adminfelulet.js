import React from 'react';
import { Link } from 'react-router-dom';
import './AdminStyles.css';

const Adminfelulet = () => {
    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'var(--accent)', marginBottom: '10px', fontSize: '2rem' }}>Admin Felület</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Válassz az alábbi adminisztrációs lehetőségek közül:</p>
            </div>

            <div className="admin-grid">
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>🌍 Országok kezelése</h3>
                    </div>
                    <div className="admin-card-body">
                        <p>Országok hozzáadása, módosítása és keresése az adatbázisban.</p>
                        <ul className="admin-features">
                            <li>Új ország hozzáadása</li>
                            <li>Országadatok módosítása</li>
                            <li>Keresés név és ID alapján</li>
                            <li>Adatok megjelenítése</li>
                        </ul>
                    </div>
                    <div className="admin-card-footer">
                        <Link to="/OrszagModosit" className="admin-button admin-button-primary">
                            Országok kezelése
                        </Link>
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>⚽ Foci játékok</h3>
                    </div>
                    <div className="admin-card-body">
                        <p>Foci játékok és meccsek adminisztrálása.</p>
                        <ul className="admin-features">
                            <li>Játékok hozzáadása</li>
                            <li>Eredmények rögzítése</li>
                            <li>Csapatok kezelése</li>
                            <li>Statisztikák</li>
                        </ul>
                    </div>
                    <div className="admin-card-footer">
                        <Link to="/FociJatekModosit" className="admin-button admin-button-secondary">
                            Foci játékok
                        </Link>
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>📊 Statisztikák</h3>
                    </div>
                    <div className="admin-card-body">
                        <p>Rendszer statisztikák és jelentések megtekintése.</p>
                        <ul className="admin-features">
                            <li>Felhasználói aktivitás</li>
                            <li>Adatbázis statisztikák</li>
                            <li>Rendszer állapot</li>
                            <li>Jelentések generálása</li>
                        </ul>
                    </div>
                    <div className="admin-card-footer">
                        <Link to="/Statisztikak" className="admin-button admin-button-info">
                            Statisztikák
                        </Link>
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>⚙️ Beállítások</h3>
                    </div>
                    <div className="admin-card-body">
                        <p>Rendszer beállítások és konfigurációk.</p>
                        <ul className="admin-features">
                            <li>Felhasználók kezelése</li>
                            <li>Jogosultságok</li>
                            <li>Rendszer konfiguráció</li>
                            <li>Biztonsági beállítások</li>
                        </ul>
                    </div>
                    <div className="admin-card-footer">
                        <Link to="/Beallitasok" className="admin-button admin-button-warning">
                            Beállítások
                        </Link>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link to="/" className="admin-button" style={{ 
                    backgroundColor: '#1a73e8', 
                    color: 'white', 
                    padding: '10px 20px', 
                    textDecoration: 'none', 
                    borderRadius: '5px',
                    display: 'inline-block'
                }}>
                    ← Vissza a főoldalra
                </Link>
            </div>
        </div>
    );
};

export default Adminfelulet;