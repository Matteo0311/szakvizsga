import React, { useState, useEffect } from 'react';
import './FelhasznaloAdatModositStyles.css';
import { useAuth } from '../../AuthContext';
import UserSidebar from '../UserSidebar';
import config from '../../config';
import { FaEdit } from '../UserProfileIcons';
import { useNavigate } from 'react-router-dom';

const FelhasznaloAdatModosit = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [felhNev, setFelhNev] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // 'nev' | 'email' | 'jelszo' | null
  const [modalInput, setModalInput] = useState({
    nev: '',
    email: '',
    emailUjra: '',
    regiJelszo: '',
    ujJelszo: '',
    ujJelszoUjra: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/sajatFelhAdatok`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFelhNev(data.felh_nev || '');
          setEmail(data.email || '');
        }
      } catch (e) { /* hiba esetén nem töltjük be */ }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleDelete = async () => {
    setMessage('');
    setError('');
    if (!window.confirm('Biztosan törölni szeretné a profilját? Ez nem visszavonható!')) return;
    try {
      const response = await fetch(`${config.API_BASE_URL}/sajatFelhTorles`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Profil törölve!');
        logout();
        navigate('/'); // Azonnali átirányítás a kezdőlapra
      } else {
        setError(data.error || data.message || 'Hiba történt!');
      }
    } catch (err) {
      setError('Hálózati hiba!');
    }
  };

  // MODAL HANDLEREK
  const handleNevModosit = async () => {
    setMessage(''); setError('');
    if (!modalInput.nev) { setError('Adj meg új nevet!'); return; }
    try {
      const response = await fetch(`${config.API_BASE_URL}/sajatFelhModosit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ felh_nev: modalInput.nev })
      });
      const data = await response.json();
      if (response.ok) {
        setFelhNev(modalInput.nev);
        setMessage('Felhasználónév sikeresen módosítva!');
        setModal(null);
        setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''});
      } else {
        setError(data.error || data.message || 'Hiba történt!');
      }
    } catch (e) {
      setError('Hálózati hiba!');
    }
  };
  const handleEmailModosit = async () => {
    setMessage(''); setError('');
    if (!modalInput.email || !modalInput.emailUjra) { setError('Add meg kétszer az új email címet!'); return; }
    if (modalInput.email !== modalInput.emailUjra) { setError('Az email címek nem egyeznek!'); return; }
    try {
      const response = await fetch(`${config.API_BASE_URL}/sajatFelhModosit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: modalInput.email })
      });
      const data = await response.json();
      if (response.ok) {
        setEmail(modalInput.email);
        setMessage('Email sikeresen módosítva!');
        setModal(null);
        setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''});
      } else {
        setError(data.error || data.message || 'Hiba történt!');
      }
    } catch (e) {
      setError('Hálózati hiba!');
    }
  };
  const handleJelszoModosit = async () => {
    setMessage(''); setError('');
    if (!modalInput.regiJelszo || !modalInput.ujJelszo || !modalInput.ujJelszoUjra) { setError('Tölts ki minden mezőt!'); return; }
    if (modalInput.ujJelszo !== modalInput.ujJelszoUjra) { setError('Az új jelszavak nem egyeznek!'); return; }
    if (modalInput.ujJelszo.length < 6) { setError('A jelszó legalább 6 karakter legyen!'); return; }
    try {
      const response = await fetch(`${config.API_BASE_URL}/sajatJelszoModosit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          regi_jelszo: modalInput.regiJelszo,
          uj_jelszo: modalInput.ujJelszo,
          uj_jelszo_ismet: modalInput.ujJelszoUjra
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Jelszó sikeresen módosítva!');
        setModal(null);
        setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''});
      } else {
        setError(data.error || data.message || 'Hiba történt!');
      }
    } catch (e) {
      setError('Hálózati hiba!');
    }
  };

  return (
    <>
      <UserSidebar />
      <div className="adatmodosit-container" style={{ marginLeft: 120, minWidth: 400, maxWidth: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', background: '#fff', borderRadius: 16, padding: '2.5rem 2rem', marginTop: 48 }}>
        <h2 style={{textAlign: 'center', marginBottom: 32}}>Adatmódosítás</h2>
        <div className="adatmodosit-row" style={{display: 'flex', alignItems: 'center', marginBottom: 24}}>
          <label style={{flex: 1, fontWeight: 500}}>Felhasználónév</label>
          <input type="text" value={felhNev} disabled style={{flex: 2, marginRight: 12, background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6, padding: '0.5rem'}} />
          <span className="edit-icon" style={{cursor: 'pointer', color: '#1976d2', fontSize: 22}} onClick={() => setModal('nev')}><FaEdit /></span>
        </div>
        <div className="adatmodosit-row" style={{display: 'flex', alignItems: 'center', marginBottom: 24}}>
          <label style={{flex: 1, fontWeight: 500}}>Email</label>
          <input type="email" value={email} disabled style={{flex: 2, marginRight: 12, background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6, padding: '0.5rem'}} />
          <span className="edit-icon" style={{cursor: 'pointer', color: '#1976d2', fontSize: 22}} onClick={() => setModal('email')}><FaEdit /></span>
        </div>
        <div className="adatmodosit-row" style={{display: 'flex', alignItems: 'center', marginBottom: 32}}>
          <label style={{flex: 1, fontWeight: 500}}>Jelszó</label>
          <input type="password" value={"********"} disabled style={{flex: 2, marginRight: 12, background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6, padding: '0.5rem'}} />
          <span className="edit-icon" style={{cursor: 'pointer', color: '#1976d2', fontSize: 22}} onClick={() => setModal('jelszo')}><FaEdit /></span>
        </div>
        <button className="delete-btn" onClick={handleDelete} style={{marginTop: 24, width: 180, marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>Profil törlése</button>
        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}
      </div>

      {/* MODALOK */}
      {modal === 'nev' && (
        <div className="adatmodosit-modal">
          <div className="adatmodosit-modal-content">
            <h3>Felhasználónév módosítása</h3>
            <input type="text" placeholder="Új felhasználónév" value={modalInput.nev} onChange={e => setModalInput(i => ({...i, nev: e.target.value}))} />
            <input type="password" placeholder="Jelenlegi jelszó" value={modalInput.regiJelszo} onChange={e => setModalInput(i => ({...i, regiJelszo: e.target.value}))} />
            <div className="modal-btns">
              <button className="modal-save-btn" onClick={async () => { await handleNevModosit(); }}>Mentés</button>
              <button className="modal-cancel-btn" onClick={() => { setModal(null); setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''}); }}>Mégse</button>
            </div>
          </div>
        </div>
      )}
      {modal === 'email' && (
        <div className="adatmodosit-modal">
          <div className="adatmodosit-modal-content">
            <h3>Email módosítása</h3>
            <input type="email" placeholder="Új email" value={modalInput.email} onChange={e => setModalInput(i => ({...i, email: e.target.value}))} />
            <input type="email" placeholder="Új email újra" value={modalInput.emailUjra} onChange={e => setModalInput(i => ({...i, emailUjra: e.target.value}))} />
            <input type="password" placeholder="Jelenlegi jelszó" value={modalInput.regiJelszo} onChange={e => setModalInput(i => ({...i, regiJelszo: e.target.value}))} />
            <div className="modal-btns">
              <button className="modal-save-btn" onClick={async () => { await handleEmailModosit(); }}>Mentés</button>
              <button className="modal-cancel-btn" onClick={() => { setModal(null); setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''}); }}>Mégse</button>
            </div>
          </div>
        </div>
      )}
      {modal === 'jelszo' && (
        <div className="adatmodosit-modal">
          <div className="adatmodosit-modal-content">
            <h3>Jelszó módosítása</h3>
            <input type="password" placeholder="Jelenlegi jelszó" value={modalInput.regiJelszo} onChange={e => setModalInput(i => ({...i, regiJelszo: e.target.value}))} />
            <input type="password" placeholder="Új jelszó" value={modalInput.ujJelszo} onChange={e => setModalInput(i => ({...i, ujJelszo: e.target.value}))} />
            <input type="password" placeholder="Új jelszó újra" value={modalInput.ujJelszoUjra} onChange={e => setModalInput(i => ({...i, ujJelszoUjra: e.target.value}))} />
            <div className="modal-btns">
              <button className="modal-save-btn" onClick={async () => { await handleJelszoModosit(); }}>Mentés</button>
              <button className="modal-cancel-btn" onClick={() => { setModal(null); setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''}); }}>Mégse</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FelhasznaloAdatModosit;
