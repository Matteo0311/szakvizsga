import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
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
    const result = await Swal.fire({
      title: 'Profil törlése',
      html: '<p>Biztosan törölni szeretné a profilját?</p><p style="color: #ff6b6b; font-weight: bold;">Ez nem visszavonható!</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Igen, törlöm!',
      cancelButtonText: 'Mégse',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${config.API_BASE_URL}/sajatFelhTorles`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        await Swal.fire({
          title: 'Sikeres!',
          text: data.message || 'Profil sikeresen törölve!',
          icon: 'success',
          confirmButtonColor: '#4caf50',
          confirmButtonText: 'OK'
        });
        logout();
        navigate('/');
      } else {
        await Swal.fire({
          title: 'Hiba!',
          text: data.error || data.message || 'Hiba történt a profil törlése során!',
          icon: 'error',
          confirmButtonColor: '#d32f2f',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      await Swal.fire({
        title: 'Hálózati hiba!',
        text: 'Nem sikerült csatlakozni a szerverhez.',
        icon: 'error',
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'OK'
      });
    }
  };

  // MODAL HANDLEREK
  const handleNevModosit = async () => {
    if (!modalInput.nev) { 
      await Swal.fire({
        title: 'Hibaüzenet',
        text: 'Adj meg új nevet!',
        icon: 'warning',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'OK'
      });
      return; 
    }
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
        await Swal.fire({
          title: 'Sikeres!',
          text: 'Felhasználónév sikeresen módosítva!',
          icon: 'success',
          confirmButtonColor: '#4caf50',
          confirmButtonText: 'OK'
        });
        setModal(null);
        setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''});
      } else {
        await Swal.fire({
          title: 'Hiba!',
          text: data.error || data.message || 'Hiba történt!',
          icon: 'error',
          confirmButtonColor: '#d32f2f',
          confirmButtonText: 'OK'
        });
      }
    } catch (e) {
      await Swal.fire({
        title: 'Hálózati hiba!',
        text: 'Nem sikerült csatlakozni a szerverhez.',
        icon: 'error',
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'OK'
      });
    }
  };
  const handleEmailModosit = async () => {
    if (!modalInput.email || !modalInput.emailUjra) { 
      await Swal.fire({
        title: 'Hibaüzenet',
        text: 'Add meg kétszer az új e-mail-címet!',
        icon: 'warning',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'OK'
      });
      return; 
    }
    if (modalInput.email !== modalInput.emailUjra) { 
      await Swal.fire({
        title: 'Hibaüzenet',
        text: 'Az e-mail-címek nem egyeznek!',
        icon: 'warning',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'OK'
      });
      return; 
    }
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
        await Swal.fire({
          title: 'Sikeres!',
          text: 'E-mail-cím sikeresen módosítva!',
          icon: 'success',
          confirmButtonColor: '#4caf50',
          confirmButtonText: 'OK'
        });
        setModal(null);
        setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''});
      } else {
        await Swal.fire({
          title: 'Hiba!',
          text: data.error || data.message || 'Hiba történt!',
          icon: 'error',
          confirmButtonColor: '#d32f2f',
          confirmButtonText: 'OK'
        });
      }
    } catch (e) {
      await Swal.fire({
        title: 'Hálózati hiba!',
        text: 'Nem sikerült csatlakozni a szerverhez.',
        icon: 'error',
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'OK'
      });
    }
  };
  const handleJelszoModosit = async () => {
    if (!modalInput.regiJelszo || !modalInput.ujJelszo || !modalInput.ujJelszoUjra) { 
      await Swal.fire({
        title: 'Hibaüzenet',
        text: 'Tölts ki minden mezőt!',
        icon: 'warning',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'OK'
      });
      return; 
    }
    if (modalInput.ujJelszo !== modalInput.ujJelszoUjra) { 
      await Swal.fire({
        title: 'Hibaüzenet',
        text: 'Az új jelszavak nem egyeznek!',
        icon: 'warning',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'OK'
      });
      return; 
    }
    if (modalInput.ujJelszo.length < 6) { 
      await Swal.fire({
        title: 'Hibaüzenet',
        text: 'A jelszó legalább 6 karakter legyen!',
        icon: 'warning',
        confirmButtonColor: '#ff9800',
        confirmButtonText: 'OK'
      });
      return; 
    }
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
        await Swal.fire({
          title: 'Sikeres!',
          text: 'Jelszó sikeresen módosítva!',
          icon: 'success',
          confirmButtonColor: '#4caf50',
          confirmButtonText: 'OK'
        });
        setModal(null);
        setModalInput({nev:'',email:'',emailUjra:'',regiJelszo:'',ujJelszo:'',ujJelszoUjra:''});
      } else {
        await Swal.fire({
          title: 'Hiba!',
          text: data.error || data.message || 'Hiba történt!',
          icon: 'error',
          confirmButtonColor: '#d32f2f',
          confirmButtonText: 'OK'
        });
      }
    } catch (e) {
      await Swal.fire({
        title: 'Hálózati hiba!',
        text: 'Nem sikerült csatlakozni a szerverhez.',
        icon: 'error',
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <>
      <UserSidebar />
      <div className="adatmodosit-kozepre">
        <div className="adatmodosit-container">
          <h2 className="adatmodosit-title">Adatmódosítás</h2>
          <div className="adatmodosit-row">
            <label>Felhasználónév</label>
            <input type="text" value={felhNev} disabled />
            <span className="edit-icon" onClick={() => setModal('nev')}><FaEdit /></span>
          </div>
          <div className="adatmodosit-row">
            <label>Email</label>
            <input type="email" value={email} disabled />
            <span className="edit-icon" onClick={() => setModal('email')}><FaEdit /></span>
          </div>
          <div className="adatmodosit-row">
            <label>Jelszó</label>
            <input type="password" value={"********"} disabled />
            <span className="edit-icon" onClick={() => setModal('jelszo')}><FaEdit /></span>
          </div>

          <div className="adatmodosit-delete-section">
            <div className="delete-warning">⚠️ A profil törlése végleges, és minden adat elveszik!</div>
            <button className="delete-btn" onClick={handleDelete}>Profil törlése</button>
          </div>
        </div>
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
            <h3>E-mail-cím módosítása</h3>
            <input type="email" placeholder="Új e-mail-cím" value={modalInput.email} onChange={e => setModalInput(i => ({...i, email: e.target.value}))} />
            <input type="email" placeholder="Új e-mail-cím újra" value={modalInput.emailUjra} onChange={e => setModalInput(i => ({...i, emailUjra: e.target.value}))} />
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
