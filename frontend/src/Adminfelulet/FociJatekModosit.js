<<<<<<< HEAD
import Admin from "./Admin.css"
import { useState,useEffect } from "react"
import Cim from "../Cim"

const FociJatekModosit=({kivalasztott})=>{
        const [adatok,setAdatok]=useState([])
        const [tolt,setTolt]=useState(true)
        const [hiba,setHiba]=useState(false)
        const [modositasFelulet, setModositasFelulet] = useState(false)
        const [ujJatekFelulet, setUjJatekFelulet] = useState(false)
        const [keresesSzoveg, setKeresesSzoveg] = useState('')
        const [keresesEredmeny, setKeresesEredmeny] = useState([])
        const [keresEsben, setKeresEsben] = useState(false)
        const [modositandoJatek, setModositandoJatek] = useState({
                jatek_id: '',
                hazai_csapat: '',
                idegen_csapat: '',
                datum: '',
                eredmeny: '',
                helyszin: ''
        })
        const [ujJatek, setUjJatek] = useState({
                hazai_csapat: '',
                idegen_csapat: '',
                datum: '',
                eredmeny: '',
                helyszin: ''
        })

        const leToltes=async ()=>{
                setTolt(true)
                setHiba(false)
                try{
                        const response=await fetch(Cim.Cim+"/fociJatekAdatBetolt")
                        if (response.ok) {
                                const data=await response.json()
                                setAdatok(data)
                                setTolt(false)
                        } else {
                                setHiba(true)
                                setTolt(false)
                        }
                }
                catch (error){
                        console.error("Fetch hiba:", error)
                        setHiba(true)
                        setTolt(false)
                }
        }
        useEffect(()=>{
                leToltes()
        },[])

        // Keresés
        const keresesVegrehajtas = async (searchTerm) => {
                if (!searchTerm.trim()) {
                        setKeresesEredmeny([]);
                        return;
                }

                setKeresEsben(true);
                try {
                        const response = await fetch(`${Cim.Cim}/fociJatekKereses/${encodeURIComponent(searchTerm)}`);
                        if (response.ok) {
                                const data = await response.json();
                                setKeresesEredmeny(data);
                        } else if (response.status === 404) {
                                setKeresesEredmeny([]);
                        } else {
                                console.error("Keresési hiba:", response.status, response.statusText);
                                setKeresesEredmeny([]);
                        }
                } catch (error) {
                        console.error("Fetch hiba a keresés során:", error);
                        setKeresesEredmeny([]);
                } finally {
                        setKeresEsben(false);
                }
        };

        const keresesInputValtozas = (e) => {
                const value = e.target.value;
                setKeresesSzoveg(value);
                clearTimeout(window.searchTimeout);
                window.searchTimeout = setTimeout(() => {
                        keresesVegrehajtas(value);
                }, 300);
        };

        const keresesTorles = () => {
                setKeresesSzoveg('');
                setKeresesEredmeny([]);
                clearTimeout(window.searchTimeout);
        };

        const megjelenitoAdatok = keresesSzoveg.trim() ? keresesEredmeny : adatok;

        // Új játék hozzáadása
        const UjJatekFeluletMegnyitas = () => {
                setUjJatek({
                        hazai_csapat: '',
                        idegen_csapat: '',
                        datum: '',
                        eredmeny: '',
                        helyszin: ''
                });
                setUjJatekFelulet(true);
        };

        const UjJatekFeluletBezaras = () => {
                setUjJatekFelulet(false);
                setUjJatek({
                        hazai_csapat: '',
                        idegen_csapat: '',
                        datum: '',
                        eredmeny: '',
                        helyszin: ''
                });
        };

        const UjJatekInputValtozas = (e) => {
                const { name, value } = e.target;
                setUjJatek(prev => ({
                        ...prev,
                        [name]: value
                }));
        };

        const UjJatekHozzaadas = async () => {
                if (!ujJatek.hazai_csapat || !ujJatek.idegen_csapat || !ujJatek.datum) {
                        alert('Kérlek töltsd ki legalább a csapatokat és a dátumot!');
                        return;
                }

                try {
                        const response = await fetch(`${Cim.Cim}/ujFociJatekFelvitele`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(ujJatek),
                        });

                        if (response.ok) {
                                alert('Új meccs sikeresen hozzáadva!');
                                UjJatekFeluletBezaras();
                                leToltes();
                        } else {
                                const error = await response.json();
                                alert(`Hiba történt: ${error.error}`);
                        }
                } catch (error) {
                        console.error('Hiba történt a meccs hozzáadása során:', error);
                        alert('Hiba történt a meccs hozzáadása során!');
                }
        };

        // Módosítás
        const ModositasFeluletMegnyitas = (jatek) => {
                setModositandoJatek({
                        jatek_id: jatek.jatek_id,
                        hazai_csapat: jatek.hazai_csapat,
                        idegen_csapat: jatek.idegen_csapat,
                        datum: jatek.datum,
                        eredmeny: jatek.eredmeny,
                        helyszin: jatek.helyszin
                });
                setModositasFelulet(true);
        };

        const ModositasFeluletBezaras = () => {
                setModositasFelulet(false);
                setModositandoJatek({
                        jatek_id: '',
                        hazai_csapat: '',
                        idegen_csapat: '',
                        datum: '',
                        eredmeny: '',
                        helyszin: ''
                });
        };

        const InputValtozas = (e) => {
                const { name, value } = e.target;
                setModositandoJatek(prev => ({
                        ...prev,
                        [name]: value
                }));
        };

        const JatekModositas = async () => {
                if (!modositandoJatek.hazai_csapat || !modositandoJatek.idegen_csapat || !modositandoJatek.datum) {
                        alert('Kérlek töltsd ki legalább a csapatokat és a dátumot!');
                        return;
                }

                const megerosites = window.confirm(`Biztos, hogy módosítani szeretnéd a meccs adatait?`);
                if (!megerosites) return;

                try {
                        const response = await fetch(`${Cim.Cim}/fociJatekAdatModosit/${modositandoJatek.jatek_id}`, {
                                method: 'PUT',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        hazai_csapat: modositandoJatek.hazai_csapat,
                                        idegen_csapat: modositandoJatek.idegen_csapat,
                                        datum: modositandoJatek.datum,
                                        eredmeny: modositandoJatek.eredmeny,
                                        helyszin: modositandoJatek.helyszin
                                }),
                        });

                        if (response.ok) {
                                alert('A meccs adatai sikeresen módosítva!');
                                ModositasFeluletBezaras();
                                leToltes();
                        } else {
                                const error = await response.json();
                                alert(`Hiba történt: ${error.error}`);
                        }
                } catch (error) {
                        console.error('Hiba történt a módosítás során:', error);
                        alert('Hiba történt a módosítás során!');
                }
        };

        if (tolt)
                return (
                        <div style={{textAlign:"center"}}>Adatok betöltése folyamatban...</div>
                )
        else if (hiba)
                return (
                        <div>Hiba</div>
                )
        else return (
                <div>
                    {modositasFelulet && (
                        <div className="modal-hatter">
                            <div className="modal-tartalom">
                                <div className="modal-fejlec">
                                    <h3>Meccs adatainak módosítása</h3>
                                    <button className="bezaras-gomb" onClick={ModositasFeluletBezaras}>×</button>
                                </div>
                                <div className="modal-test">
                                    <div className="input-csoport">
                                        <label>Hazai csapat:</label>
                                        <input type="text" name="hazai_csapat" value={modositandoJatek.hazai_csapat} onChange={InputValtozas} placeholder="Hazai csapat" />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Idegen csapat:</label>
                                        <input type="text" name="idegen_csapat" value={modositandoJatek.idegen_csapat} onChange={InputValtozas} placeholder="Idegen csapat" />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Dátum:</label>
                                        <input type="datetime-local" name="datum" value={modositandoJatek.datum} onChange={InputValtozas} />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Eredmény:</label>
                                        <input type="text" name="eredmeny" value={modositandoJatek.eredmeny} onChange={InputValtozas} placeholder="Pl.: 2-1" />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Helyszín:</label>
                                        <input type="text" name="helyszin" value={modositandoJatek.helyszin} onChange={InputValtozas} placeholder="Stadion / Város" />
                                    </div>
                                </div>
                                <div className="modal-lablelc">
                                    <button className="admin-button" onClick={JatekModositas}>Módosítások mentése</button>
                                    <button className="admin-button visszavon" onClick={ModositasFeluletBezaras}>Mégsem</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {ujJatekFelulet && (
                        <div className="modal-hatter">
                            <div className="modal-tartalom">
                                <div className="modal-fejlec">
                                    <h3>Új meccs hozzáadása</h3>
                                    <button className="bezaras-gomb" onClick={UjJatekFeluletBezaras}>×</button>
                                </div>
                                <div className="modal-test">
                                    <div className="input-csoport">
                                        <label>Hazai csapat:</label>
                                        <input type="text" name="hazai_csapat" value={ujJatek.hazai_csapat} onChange={UjJatekInputValtozas} placeholder="Hazai csapat" />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Idegen csapat:</label>
                                        <input type="text" name="idegen_csapat" value={ujJatek.idegen_csapat} onChange={UjJatekInputValtozas} placeholder="Idegen csapat" />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Dátum:</label>
                                        <input type="datetime-local" name="datum" value={ujJatek.datum} onChange={UjJatekInputValtozas} />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Eredmény:</label>
                                        <input type="text" name="eredmeny" value={ujJatek.eredmeny} onChange={UjJatekInputValtozas} placeholder="Pl.: 2-1 (opcionális)" />
                                    </div>
                                    <div className="input-csoport">
                                        <label>Helyszín:</label>
                                        <input type="text" name="helyszin" value={ujJatek.helyszin} onChange={UjJatekInputValtozas} placeholder="Stadion / Város" />
                                    </div>
                                </div>
                                <div className="modal-lablelc">
                                    <button className="admin-button" onClick={UjJatekHozzaadas}>Meccs hozzáadása</button>
                                    <button className="admin-button visszavon" onClick={UjJatekFeluletBezaras}>Mégsem</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Foci meccsek kezelése</h2>
                            <button className="admin-button" onClick={UjJatekFeluletMegnyitas}>Új meccs hozzáadása</button>
                        </div>

                        <div className="kereses-container">
                            <div className="kereses-input-csoport">
                                <input type="text" className="kereses-input" placeholder="Keresés csapat, helyszín vagy ID alapján..." value={keresesSzoveg} onChange={keresesInputValtozas} />
                                {keresesSzoveg && (<button className="kereses-torles" onClick={keresesTorles}>×</button>)}
                                {keresEsben && (<div className="kereses-loading">🔍</div>)}
                            </div>
                            {keresesSzoveg && (
                                <div className="kereses-info">
                                    {keresesEredmeny.length > 0 ? `${keresesEredmeny.length} találat` : 'Nincs találat'}
                                </div>
                            )}
                        </div>

                        <div className="table-container">
                            <table className="adat-tablazat">
                                <thead>
                                    <tr>
                                        <th className="index-column">#</th>
                                        <th>Hazai</th>
                                        <th>Idegen</th>
                                        <th>Dátum</th>
                                        <th>Eredmény</th>
                                        <th>Helyszín</th>
                                        <th>Műveletek</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {megjelenitoAdatok.length > 0 ? (
                                        megjelenitoAdatok.map((elem,index)=>(
                                            <tr key={elem.jatek_id || index} className="adat-sor">
                                                <td>{keresesSzoveg.trim() ? elem.jatek_id : index + 1}</td>
                                                <td className="orszag-nev">{elem.hazai_csapat}</td>
                                                <td className="orszag-nev">{elem.idegen_csapat}</td>
                                                <td className="szam-adat">{elem.datum}</td>
                                                <td className="szam-adat">{elem.eredmeny || '-'}</td>
                                                <td className="szam-adat">{elem.helyszin || '-'}</td>
                                                <td><button className="torles-gomb" onClick={() => ModositasFeluletMegnyitas(elem)}>Szerkesztés</button></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                                {keresesSzoveg.trim() ? 'Nincs találat a keresési feltételre' : 'Nincs megjeleníthető adat'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button className="admin-button" onClick={() => window.history.back()}>Visszatérés az adminfelületre</button>
                        </div>
                    </div>
                </div>
        )
=======
import React from 'react';
import './AdminStyles.css';

const FociJatekModosit = () => {
    return (
        <div className="container">
            <h1>⚽ Foci Játék Módosítás</h1>
            <p>Itt módosíthatod a focijáték beállításait.</p>
        </div>
    );
>>>>>>> 4fa1eb1fade2c5a163dbb3acfaf2f6d8f0648b3d
}
export default FociJatekModosit;
