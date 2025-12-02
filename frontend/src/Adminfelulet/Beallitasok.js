import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './BeallitasokStyles.css';
import config from '../config';
import { FaUsers, FaUser, FaCrown, FaEnvelope, FaIdCard, FaCalendarAlt, FaEdit, FaTrash, FaCheck, FaTimes, FaInbox, FaSearch } from 'react-icons/fa';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ felhasznalonev: '', email: '', szerepkor: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [filterBy, setFilterBy] = useState('regisztracio_ido');
    const [order, setOrder] = useState('desc');

    useEffect(() => {
        // Regisztráció állapot betöltése
        const savedRegistration = localStorage.getItem('registrationEnabled');
        if (savedRegistration !== null) {
            setRegistrationEnabled(JSON.parse(savedRegistration));
        }
    }, []);

    // Automatikus betöltés amikor a modal megnyílik és nincsenek felhasználók
    useEffect(() => {
        if (showUserManagement && users.length === 0 && !loading && !error) {
            fetchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showUserManagement]);

    // Automatikus frissítés amikor a szűrési paraméterek változnak
    useEffect(() => {
        if (showUserManagement && users.length > 0 && !loading && !searchTerm) {
            fetchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterBy, order]);

    const fetchUsers = async (useFilter = true) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Nincs token. Kérlek jelentkezz be újra!');
            }
            
            // Endpoint választása: szűréssel vagy alapértelmezett
            const endpoint = useFilter 
                ? `${config.API_BASE_URL}/felhasznaloSzuro/${filterBy}/${order}`
                : `${config.API_BASE_URL}/felhasznalokLekerdezese`;
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || `Hiba: ${response.status}`);
            }

            const data = await response.json();
            
            // Ha nem tömb, akkor próbáljuk meg kicsomagolni
            let users = Array.isArray(data) ? data : (data.rows || data.data || []);
            
            // Minden felhasználó megjelenítése, duplikációk szűrése ID alapján
            const uniqueUsers = Array.from(
                new Map(users.map(user => [user.id || user.felh_id, user])).values()
            );
            
            setUsers(uniqueUsers);
            setCurrentPage(1); // Első oldalra ugrás új adatok betöltésekor
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setFilterBy('regisztracio_ido');
        setOrder('desc');
        fetchUsers(false); // Alapértelmezett lekérdezés szűrés nélkül
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Biztosan törölni szeretnéd a(z) "${username}" felhasználót?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${config.API_BASE_URL}/felhasznaloTorles/${userId}`, {
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
            szerepkor: user.felh_szerepkor || user.szerepkor || 'user'
        });
        setShowEditModal(true);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setShowEditModal(false);
        setEditForm({ felhasznalonev: '', email: '', szerepkor: '' });
    };

    const handleUpdateUser = async () => {
        if (!editForm.felhasznalonev || !editForm.email) {
            alert('Felhasználónév és email megadása kötelező!');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            // Javított endpoint név - eltávolítva az ékezetes karakterek
            const url = `${config.API_BASE_URL}/felhasznaloModosit/${editingUser}`;
            console.log('Módosítási kérés URL:', url);
            console.log('Módosítási adatok:', {
                felh_nev: editForm.felhasznalonev,
                email: editForm.email,
                felh_szerepkor: editForm.szerepkor
            });
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    felh_nev: editForm.felhasznalonev,
                    email: editForm.email,
                    felh_szerepkor: editForm.szerepkor
                })
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers.get('content-type'));

            if (!response.ok) {
                // Próbáljuk meg JSON-ként parse-olni, ha nem sikerül, használjuk a status text-et
                let errorMessage = 'Hiba a felhasználó módosításakor';
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData.error || errorMessage;
                    } else {
                        errorMessage = `Szerver hiba: ${response.status} ${response.statusText}`;
                    }
                } catch (parseError) {
                    errorMessage = `Szerver hiba: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            // Frissítjük a listát
            await fetchUsers();
            setShowEditModal(false);
            setEditingUser(null);
            setEditForm({ felhasznalonev: '', email: '', szerepkor: '' });
            alert('Felhasználó sikeresen módosítva!');
        } catch (err) {
            console.error('Módosítási hiba:', err);
            alert('Hiba történt: ' + err.message);
        }
    };

    const toggleRegistration = () => {
        const newState = !registrationEnabled;
        setRegistrationEnabled(newState);
        localStorage.setItem('registrationEnabled', JSON.stringify(newState));
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert('Kérlek adj meg keresési kifejezést!');
            return;
        }

        setSearchLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Nincs token. Kérlek jelentkezz be újra!');
            }
            
            const response = await fetch(`${config.API_BASE_URL}/felhasznaloKereses/${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setError('Nincs találat a keresési feltételre.');
                    setUsers([]);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || errorData.error || `Hiba: ${response.status}`);
                }
            } else {
                const data = await response.json();
                
                // Ha nem tömb, akkor próbáljuk meg kicsomagolni
                let users = Array.isArray(data) ? data : (data.rows || data.data || []);
                
                // Duplikációk szűrése ID alapján
                const uniqueUsers = Array.from(
                    new Map(users.map(user => [user.id || user.felh_id, user])).values()
                );
                
                setUsers(uniqueUsers);
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Keresési hiba:', err);
            setError(err.message);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setError(null);
        setUsers([]);
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
                                        : '❌ A regisztráció jelenleg le van tiltva.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profilok kezelése */}
                    <div 
                        className="settings-card clickable-card" 
                        onClick={() => setShowUserManagement(true)}
                    >
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
                            <div className="settings-card-action">
                                <span className="action-hint">� Kattints a megnyitáshoz</span>
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

                {/* Felhasználókezelő panel - ÚJ DIZÁJN */}
                {showUserManagement && (
                    <div className="user-management-modal-new" onClick={() => setShowUserManagement(false)}>
                        <div className="modal-backdrop"></div>
                        <div className="user-management-content-new" onClick={(e) => e.stopPropagation()}>
                            <div className="user-management-header-new">
                                <div className="header-title-section">
                                    <div className="title-icon">
                                        <FaUsers />
                                    </div>
                                    <div>
                                        <h2>Regisztrált felhasználók</h2>
                                        <p className="header-subtitle">
                                            {users.length > 0 ? `${users.length} felhasználó` : 'Keresés és felhasználókezelés'}
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

                            {/* Keresési és szűrési rész */}
                            <div className="user-management-search-section">
                                {/* Keresősáv */}
                                <div className="search-bar-container">
                                    <div className="search-input-group-enhanced">
                                        <FaSearch className="search-icon-enhanced" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && searchTerm.trim() && handleSearch()}
                                            placeholder="🔍 Keresés felhasználónév vagy ID alapján..."
                                            className="search-input-enhanced"
                                        />
                                        {searchTerm && (
                                            <>
                                                <button 
                                                    onClick={handleSearch}
                                                    className="inline-search-btn-enhanced"
                                                    disabled={searchLoading || !searchTerm.trim()}
                                                    title="Keresés"
                                                >
                                                    {searchLoading ? (
                                                        <div className="search-spinner"></div>
                                                    ) : (
                                                        <FaSearch />
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        handleClearSearch();
                                                        fetchUsers();
                                                    }}
                                                    className="clear-search-btn-enhanced"
                                                    title="Törlés"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Szűrési opciók */}
                                <div className="filter-section-container">
                                    <div className="filter-controls-enhanced">
                                        <div className="filter-group-enhanced">
                                            <label htmlFor="filterBy" className="filter-label-enhanced">
                                                📊 Rendezés alapja
                                            </label>
                                            <select 
                                                id="filterBy"
                                                value={filterBy}
                                                onChange={(e) => setFilterBy(e.target.value)}
                                                className="filter-select-enhanced"
                                            >
                                                <option value="regisztracio_ido">📅 Regisztráció időpontja</option>
                                                <option value="szerepkor">👤 Szerepkör</option>
                                            </select>
                                        </div>

                                        <div className="filter-group-enhanced">
                                            <label htmlFor="order" className="filter-label-enhanced">
                                                🔄 Sorrend
                                            </label>
                                            <select 
                                                id="order"
                                                value={order}
                                                onChange={(e) => setOrder(e.target.value)}
                                                className="filter-select-enhanced"
                                            >
                                                <option value="asc">⬆️ Növekvő</option>
                                                <option value="desc">⬇️ Csökkenő</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="filter-actions-enhanced">
                                        <button 
                                            onClick={() => fetchUsers(true)} 
                                            className="apply-filter-btn"
                                            disabled={loading}
                                            title="Szűrés alkalmazása"
                                        >
                                            <FaCheck />
                                            <span>{loading ? 'Betöltés...' : 'Szűrés alkalmazása'}</span>
                                        </button>
                                        <button 
                                            onClick={handleResetFilters}
                                            className="reset-filter-btn"
                                            disabled={loading}
                                            title="Alapértelmezett nézet visszaállítása"
                                        >
                                            <FaTimes />
                                            <span>Alapértelmezett</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="users-grid-container">
                                {users.length === 0 ? (
                                    <div className="no-users-new">
                                        <div className="no-users-icon">
                                            <FaInbox size={80} />
                                        </div>
                                        {error ? (
                                            <>
                                                <h3>❌ {error}</h3>
                                                <p>Próbáld meg újra vagy módosítsd a keresési feltételt</p>
                                            </>
                                        ) : (
                                            <>
                                                <h3>Nincs regisztrált felhasználó</h3>
                                                <p>Még nem található felhasználó az adatbázisban</p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <>
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
                                                <div key={userId} className="user-card">
                                                    {/* NORMÁL NÉZET */}
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
                                                                <span className={`role-badge-new ${user.felh_szerepkor || user.szerepkor}`}>
                                                                    {(user.felh_szerepkor || user.szerepkor) === 'admin' ? (
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

                {/* Szerkesztési Modal */}
                {showEditModal && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal">
                            <div className="edit-modal-header">
                                <h2>
                                    <FaEdit className="modal-icon" />
                                    Felhasználó szerkesztése
                                </h2>
                                <button 
                                    onClick={handleCancelEdit}
                                    className="modal-close-btn"
                                    title="Bezárás"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            
                            <div className="edit-modal-body">

                                <div className="form-group-modal">
                                    <label>
                                        <FaUser className="form-icon" />
                                        Felhasználónév *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.felhasznalonev}
                                        onChange={(e) => setEditForm({...editForm, felhasznalonev: e.target.value})}
                                        placeholder="Felhasználónév"
                                        className="modal-input"
                                        required
                                    />
                                </div>

                                <div className="form-group-modal">
                                    <label>
                                        <FaEnvelope className="form-icon" />
                                        Email cím *
                                    </label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                        placeholder="email@example.com"
                                        className="modal-input"
                                        required
                                    />
                                </div>

                                <div className="form-group-modal">
                                    <label>
                                        <FaCrown className="form-icon" />
                                        Szerepkör *
                                    </label>
                                    <select
                                        value={editForm.szerepkor}
                                        onChange={(e) => setEditForm({...editForm, szerepkor: e.target.value})}
                                        className="modal-select"
                                    >
                                        <option value="user">Felhasználó</option>
                                        <option value="admin">Adminisztrátor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="edit-modal-footer">
                                <button
                                    onClick={handleUpdateUser}
                                    className="modal-btn save-btn-modal"
                                >
                                    <FaCheck />
                                    <span>Mentés</span>
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="modal-btn cancel-btn-modal"
                                >
                                    <FaTimes />
                                    <span>Mégse</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Fix Visszalépés gomb - mindig látható */}
            <Link to="/adminfelulet" className="fixed-back-button">
                <span className="back-icon">←</span>
                <span>Vissza</span>
            </Link>
        </div>
    );
};

export default Beallitasok;
