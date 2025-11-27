import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './BeallitasokStyles.css';
import config from '../config';
import { FaUsers, FaUser, FaCrown, FaEnvelope, FaIdCard, FaCalendarAlt, FaEdit, FaTrash, FaCheck, FaTimes, FaInbox } from 'react-icons/fa';

const Beallitasok = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.szerepkor === 'admin';

    // Extra védelem: ha nem admin, azonnal visszairányítjuk
    useEffect(() => {
        if (!isAdmin) {
            navigate('/adminfelulet');
        }
    }, [isAdmin, navigate]);
    const [registrationEnabled, setRegistrationEnabled] = useState(true);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ felhasznalonev: '', email: '', szerepkor: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 20;

    useEffect(() => {
        // Regisztráció állapot betöltése
        const savedRegistration = localStorage.getItem('registrationEnabled');
        if (savedRegistration !== null) {
            setRegistrationEnabled(JSON.parse(savedRegistration));
        }
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Nincs token. Kérlek jelentkezz be újra!');
            }

            console.log('Token:', token);
            console.log('API URL:', `${config.API_BASE_URL}/felhasznalokLekerdezese`);
            
            const response = await fetch(`${config.API_BASE_URL}/felhasznalokLekerdezese`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);
                throw new Error(errorData.message || errorData.error || `Hiba: ${response.status}`);
            }

            const data = await response.json();
            console.log('🔍 ===== BACKEND VÁLASZ DEBUG =====');
            console.log('📦 Raw data típusa:', typeof data);
            console.log('📦 Raw data Array?:', Array.isArray(data));
            console.log('📦 Raw data:', JSON.stringify(data, null, 2));
            console.log('✅ Sikeres adatok:', data);
            console.log('📊 Összesen:', data.length, 'felhasználó');
            
            // Ha nem tömb, akkor próbáljuk meg kicsomagolni
            let users = Array.isArray(data) ? data : (data.rows || data.data || []);
            console.log('📊 Feldolgozott users:', users.length, 'felhasználó');
            console.log('👤 Minden felhasználó:', users);
            
            if (users.length > 0) {
                console.log('👤 Első felhasználó:', users[0]);
                console.log('🔑 Mező nevek:', Object.keys(users[0]));
            }
            
            // Minden felhasználó megjelenítése, duplikációk szűrése ID alapján
            const uniqueUsers = Array.from(
                new Map(users.map(user => [user.id || user.felh_id, user])).values()
            );
            
            if (data.length !== uniqueUsers.length) {
                console.warn(`⚠️ Duplikációk találva! Eredeti: ${data.length}, Egyedi: ${uniqueUsers.length}`);
            }
            
            console.log('📋 Megjelenített felhasználók:', uniqueUsers.map(u => ({
                id: u.id || u.felh_id,
                nev: u.felhasznalonev || u.felh_nev,
                email: u.email
            })));
            console.log('🔍 ===== DEBUG VÉGE =====');
            
            if (uniqueUsers.length === 0) {
                console.error('⚠️ FIGYELEM: Nincs egyetlen felhasználó sem a feldolgozott adatban!');
            }
            
            setUsers(uniqueUsers);
            setCurrentPage(1); // Első oldalra ugrás új adatok betöltésekor
            setShowUserManagement(true);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Biztosan törölni szeretnéd a(z) "${username}" felhasználót?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${config.API_BASE_URL}/felhasznaloTorlese/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Hiba a felhasználó törlésekor');
            }

            // Frissítjük a listát
            await fetchUsers();
            alert('Felhasználó sikeresen törölve!');
        } catch (err) {
            alert('Hiba történt: ' + err.message);
        }
    };

    const handleEditUser = (user) => {
        const userId = user.felh_id || user.id;
        setEditingUser(userId);
        setEditForm({
            felhasznalonev: user.felhasznalonev || user.felh_nev || '',
            email: user.email || '',
            szerepkor: user.szerepkor || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditForm({ felhasznalonev: '', email: '', szerepkor: '' });
    };

    const handleUpdateUser = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${config.API_BASE_URL}/felhasznaloModositas/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editForm)
            });

            if (!response.ok) {
                throw new Error('Hiba a felhasználó módosításakor');
            }

            // Frissítjük a listát
            await fetchUsers();
            setEditingUser(null);
            alert('Felhasználó sikeresen módosítva!');
        } catch (err) {
            alert('Hiba történt: ' + err.message);
        }
    };

    const toggleRegistration = () => {
        const newState = !registrationEnabled;
        setRegistrationEnabled(newState);
        localStorage.setItem('registrationEnabled', JSON.stringify(newState));
    };

    // Ha nem admin, ne jelenítse meg az oldalt
    if (!isAdmin) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ fontSize: '4rem' }}>🚫</div>
                <h1 style={{ color: '#e74c3c' }}>Hozzáférés megtagadva</h1>
                <p style={{ color: '#7f8c8d' }}>Ez az oldal csak adminisztrátorok számára érhető el.</p>
            </div>
        );
    }

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

                    {/* Profilok kezelése */}
                    <div className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-card-icon">
                                <span>�</span>
                            </div>
                            <div className="settings-card-title">
                                <h3>Regisztrált profilok kezelése</h3>
                                <p>Felhasználók megtekintése, módosítása és törlése</p>
                            </div>
                        </div>
                        
                        <div className="settings-card-content">
                            <button 
                                onClick={fetchUsers} 
                                className="settings-action-button"
                                disabled={loading}
                            >
                                {loading ? '⏳ Betöltés...' : '📋 Profilok megtekintése'}
                            </button>

                            {error && (
                                <div className="error-message">
                                    ❌ {error}
                                </div>
                            )}
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

                {/* Felhasználókezelő panel - ÚJ DIZÁJN */}
                {showUserManagement && (
                    <div className="user-management-modal-new">
                        <div className="modal-backdrop" onClick={() => setShowUserManagement(false)}></div>
                        <div className="user-management-content-new">
                            <div className="user-management-header-new">
                                <div className="header-title-section">
                                    <div className="title-icon">
                                        <FaUsers />
                                    </div>
                                    <div>
                                        <h2>Regisztrált felhasználók</h2>
                                        <p className="header-subtitle">
                                            {users.length} felhasználó • Kezelés és módosítás
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowUserManagement(false)} 
                                    className="close-button-new"
                                    title="Bezárás"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="users-grid-container">
                                {users.length === 0 ? (
                                    <div className="no-users-new">
                                        <div className="no-users-icon">
                                            <FaInbox size={80} />
                                        </div>
                                        <h3>Nincs regisztrált felhasználó</h3>
                                        <p>Még nem található felhasználó az adatbázisban</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Debug info - később törölhető */}
                                        <details className="debug-section">
                                            <summary>
                                                🔍 Debug: Backend adatok ({users.length} felhasználó)
                                            </summary>
                                            <div className="debug-content">
                                                <p><strong>Első felhasználó mezői:</strong></p>
                                                <pre>{users.length > 0 ? JSON.stringify(users[0], null, 2) : 'Nincs adat'}</pre>
                                                <p><strong>Összes felhasználó:</strong></p>
                                                <pre>{JSON.stringify(users, null, 2)}</pre>
                                            </div>
                                        </details>

                                        {/* Lapozási információ */}
                                        <div className="pagination-info">
                                            <p>
                                                Összesen: {users.length} felhasználó | 
                                                Oldal: {currentPage} / {Math.ceil(users.length / usersPerPage)} | 
                                                Megjelenítve: {((currentPage - 1) * usersPerPage) + 1}-{Math.min(currentPage * usersPerPage, users.length)}
                                            </p>
                                        </div>

                                        <div className="users-grid">
                                            {users
                                                .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
                                                .map((user, index) => {
                                                    const userId = user.felh_id || user.id;
                                                    return (
                                                <div key={userId} className={`user-card ${editingUser === userId ? 'editing' : ''}`}>
                                                    {editingUser === userId ? (
                                                        /* SZERKESZTÉSI MÓD */
                                                        <>
                                                            <div className="user-card-header editing">
                                                                <div className="edit-mode-badge">
                                                                    <FaEdit />
                                                                    <span>Szerkesztési mód</span>
                                                                </div>
                                                            </div>
                                                            <div className="user-card-body editing">
                                                                <div className="edit-form-group">
                                                                    <label className="edit-label">
                                                                        <FaUser className="label-icon" />
                                                                        Felhasználónév
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.felhasznalonev}
                                                                        onChange={(e) => setEditForm({...editForm, felhasznalonev: e.target.value})}
                                                                        className="edit-input-new"
                                                                        placeholder="Felhasználónév"
                                                                    />
                                                                </div>
                                                                <div className="edit-form-group">
                                                                    <label className="edit-label">
                                                                        <FaEnvelope className="label-icon" />
                                                                        Email cím
                                                                    </label>
                                                                    <input
                                                                        type="email"
                                                                        value={editForm.email}
                                                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                                        className="edit-input-new"
                                                                        placeholder="email@example.com"
                                                                    />
                                                                </div>
                                                                <div className="edit-form-group">
                                                                    <label className="edit-label">
                                                                        <FaCrown className="label-icon" />
                                                                        Szerepkör
                                                                    </label>
                                                                    <select
                                                                        value={editForm.szerepkor}
                                                                        onChange={(e) => setEditForm({...editForm, szerepkor: e.target.value})}
                                                                        className="edit-select-new"
                                                                    >
                                                                        <option value="admin">Adminisztrátor</option>
                                                                        <option value="user">Felhasználó</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="user-card-actions editing">
                                                                <button
                                                                    onClick={() => handleUpdateUser(userId)}
                                                                    className="action-btn save-btn"
                                                                >
                                                                    <FaCheck className="btn-icon" />
                                                                    <span>Mentés</span>
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="action-btn cancel-btn"
                                                                >
                                                                    <FaTimes className="btn-icon" />
                                                                    <span>Mégse</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        /* NORMÁL NÉZET */
                                                        <>
                                                            <div className="user-card-header">
                                                                <div className="user-avatar">
                                                                    <span className="avatar-text">
                                                                        {(user.felhasznalonev || user.felh_nev || 'U').charAt(0).toUpperCase()}
                                                                    </span>
                                                                    <div className="avatar-glow"></div>
                                                                </div>
                                                                <div className="user-info">
                                                                    <h3 className="user-name">
                                                                        {user.felhasznalonev || user.felh_nev || 'N/A'}
                                                                    </h3>
                                                                    <p className="user-email">
                                                                        {user.email || 'Nincs email megadva'}
                                                                    </p>
                                                                </div>
                                                                <span className={`role-badge-new ${user.szerepkor}`}>
                                                                    {user.szerepkor === 'admin' ? (
                                                                        <>
                                                                            <FaCrown className="badge-icon" />
                                                                            <span>Admin</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FaUser className="badge-icon" />
                                                                            <span>Felhasználó</span>
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="user-card-body">
                                                                <div className="user-detail-row">
                                                                    <FaIdCard className="detail-icon" />
                                                                    <span className="detail-label">Azonosító:</span>
                                                                    <span className="detail-value">#{user.felh_id || user.id || 'N/A'}</span>
                                                                </div>
                                                                <div className="user-detail-row">
                                                                    <FaCalendarAlt className="detail-icon" />
                                                                    <span className="detail-label">Létrehozva:</span>
                                                                    <span className="detail-value">
                                                                        {(() => {
                                                                            const dateField = user.regisztracio_datuma || user.created_at || user.reg_datum || user.datum;
                                                                            if (dateField) {
                                                                                try {
                                                                                    return new Date(dateField).toLocaleDateString('hu-HU', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                                    });
                                                                                } catch (e) {
                                                                                    return dateField;
                                                                                }
                                                                            }
                                                                            return 'N/A';
                                                                        })()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="user-card-actions">
                                                                <button
                                                                    onClick={() => handleEditUser(user)}
                                                                    className="action-btn edit-btn-new"
                                                                    title="Profil szerkesztése"
                                                                >
                                                                    <FaEdit className="btn-icon" />
                                                                    <span>Szerkesztés</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(userId, user.felhasznalonev || user.felh_nev || 'Felhasználó')}
                                                                    className="action-btn delete-btn-new"
                                                                    title="Profil törlése"
                                                                >
                                                                    <FaTrash className="btn-icon" />
                                                                    <span>Törlés</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        </div>

                                        {/* Lapozási gombok */}
                                        {users.length > usersPerPage && (
                                            <div className="pagination-controls">
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    disabled={currentPage === 1}
                                                    className="pagination-btn"
                                                    title="Első oldal"
                                                >
                                                    ⏮️ Első
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="pagination-btn"
                                                    title="Előző oldal"
                                                >
                                                    ◀️ Előző
                                                </button>
                                                
                                                <div className="pagination-pages">
                                                    {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => i + 1)
                                                        .filter(page => {
                                                            // Megjelenít 5 oldalt: aktuális +/- 2
                                                            return Math.abs(page - currentPage) <= 2 || page === 1 || page === Math.ceil(users.length / usersPerPage);
                                                        })
                                                        .map((page, idx, arr) => {
                                                            // Három pont beszúrása ha van hiány
                                                            const prevPage = arr[idx - 1];
                                                            const showEllipsis = prevPage && page - prevPage > 1;
                                                            
                                                            return (
                                                                <React.Fragment key={page}>
                                                                    {showEllipsis && <span className="pagination-ellipsis">...</span>}
                                                                    <button
                                                                        onClick={() => setCurrentPage(page)}
                                                                        className={`pagination-btn page-number ${currentPage === page ? 'active' : ''}`}
                                                                        title={`${page}. oldal`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                </div>

                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(users.length / usersPerPage), prev + 1))}
                                                    disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                                                    className="pagination-btn"
                                                    title="Következő oldal"
                                                >
                                                    Következő ▶️
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(Math.ceil(users.length / usersPerPage))}
                                                    disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                                                    className="pagination-btn"
                                                    title="Utolsó oldal"
                                                >
                                                    Utolsó ⏭️
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

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
