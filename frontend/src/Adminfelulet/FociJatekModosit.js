import Admin from "./Admin.css"
import { useState,useEffect } from "react"
import Cim from "../Cim"
import Swal from 'sweetalert2'

const FociJatekModosit=({kivalasztott})=>{
        const [adatok,setAdatok]=useState([])
        const [tolt,setTolt]=useState(true)
        const [hiba,setHiba]=useState(false)
        const [modositasFelulet, setModositasFelulet] = useState(false)
        const [ujJatekFelulet, setUjJatekFelulet] = useState(false)
        const [keresesSzoveg, setKeresesSzoveg] = useState('')
        const [keresesEredmeny, setKeresesEredmeny] = useState([])
        const [keresEsben, setKeresEsben] = useState(false)
        const [jelenlegiOldal, setJelenlegiOldal] = useState(1)
        const [oldalMeret] = useState(20)
        const [modositandoJatekos, setModositandoJatekos] = useState({
                foci_jatekos_id: '',
                foci_jatekos_nev: '',
                foci_jatekos_ertekeles: '',
                foci_jatekos_piaci_ertek: '',
                foci_jatekos_eletkor: ''
        })
        const [ujJatekos, setUjJatekos] = useState({
                foci_jatekos_nev: '',
                foci_jatekos_ertekeles: '',
                foci_jatekos_piaci_ertek: '',
                foci_jatekos_eletkor: ''
        })

        const leToltes=async ()=>{
                setTolt(true)
                setHiba(false)
                try{
                        const response=await fetch(Cim.Cim+"/fociJatekosAdatBetolt")
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
                        const response = await fetch(`${Cim.Cim}/fociJatekosKereses/${encodeURIComponent(searchTerm)}`);
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
                setJelenlegiOldal(1); // Reset to first page on search
                clearTimeout(window.searchTimeout);
                window.searchTimeout = setTimeout(() => {
                        keresesVegrehajtas(value);
                }, 300);
        };

        const keresesTorles = () => {
                setKeresesSzoveg('');
                setKeresesEredmeny([]);
                setJelenlegiOldal(1); // Reset to first page
                clearTimeout(window.searchTimeout);
        };

        const megjelenitoAdatok = keresesSzoveg.trim() ? keresesEredmeny : adatok;

        // Pagination számítások
        const osszesOldal = Math.ceil(megjelenitoAdatok.length / oldalMeret);
        const kezdoIndex = (jelenlegiOldal - 1) * oldalMeret;
        const vegIndex = kezdoIndex + oldalMeret;
        const jelenlegiJatekosok = megjelenitoAdatok.slice(kezdoIndex, vegIndex);

        const kovetkezoOldal = () => {
                if (jelenlegiOldal < osszesOldal) {
                        setJelenlegiOldal(jelenlegiOldal + 1);
                }
        };

        const elozoOldal = () => {
                if (jelenlegiOldal > 1) {
                        setJelenlegiOldal(jelenlegiOldal - 1);
                }
        };

        const ugrasoldalra = (oldalSzam) => {
                setJelenlegiOldal(oldalSzam);
        };

        // Új játék hozzáadása
        const UjJatekosFeluletMegnyitas = () => {
                setUjJatekos({
                        foci_jatekos_nev: '',
                        foci_jatekos_ertekeles: '',
                        foci_jatekos_piaci_ertek: '',
                        foci_jatekos_eletkor: ''
                });
                setUjJatekFelulet(true);
        };

        const UjJatekosFeluletBezaras = () => {
                setUjJatekFelulet(false);
                setUjJatekos({
                        foci_jatekos_nev: '',
                        foci_jatekos_ertekeles: '',
                        foci_jatekos_piaci_ertek: '',
                        foci_jatekos_eletkor: ''
                });
        };

        const UjJatekosInputValtozas = (e) => {
                const { name, value } = e.target;
                setUjJatekos(prev => ({
                        ...prev,
                        [name]: value
                }));
        };

        const UjJatekosHozzaadas = async () => {
                if (!ujJatekos.foci_jatekos_nev) {
                        Swal.fire({
                                icon: 'warning',
                                title: 'Hiányzó adat',
                                text: 'Kérlek add meg a játékos nevét!',
                                confirmButtonText: 'OK'
                        });
                        return;
                }

                try {
                        const response = await fetch(`${Cim.Cim}/ujFociJatekosFelvitele`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(ujJatekos),
                        });

                        if (response.ok) {
                                Swal.fire({
                                        icon: 'success',
                                        title: 'Sikeres hozzáadás',
                                        text: 'Új játékos sikeresen hozzáadva!',
                                        confirmButtonText: 'OK'
                                });
                                UjJatekosFeluletBezaras();
                                leToltes();
                        } else {
                                const error = await response.json();
                                Swal.fire({
                                        icon: 'error',
                                        title: 'Hiba',
                                        text: `Hiba történt: ${error.error}`,
                                        confirmButtonText: 'OK'
                                });
                        }
                } catch (error) {
                        console.error('Hiba történt a játékos hozzáadása során:', error);
                        Swal.fire({
                                icon: 'error',
                                title: 'Hiba',
                                text: 'Hiba történt a játékos hozzáadása során!',
                                confirmButtonText: 'OK'
                        });
                }
        };

        // Módosítás
        const ModositasFeluletMegnyitas = (jatekos) => {
                setModositandoJatekos({
                        foci_jatekos_id: jatekos.foci_jatekos_id,
                        foci_jatekos_nev: jatekos.foci_jatekos_nev,
                        foci_jatekos_ertekeles: jatekos.foci_jatekos_ertekeles,
                        foci_jatekos_piaci_ertek: jatekos.foci_jatekos_piaci_ertek,
                        foci_jatekos_eletkor: jatekos.foci_jatekos_eletkor
                });
                setModositasFelulet(true);
        };

        const ModositasFeluletBezaras = () => {
                setModositasFelulet(false);
                setModositandoJatekos({
                        foci_jatekos_id: '',
                        foci_jatekos_nev: '',
                        foci_jatekos_ertekeles: '',
                        foci_jatekos_piaci_ertek: '',
                        foci_jatekos_eletkor: ''
                });
        };

        const InputValtozas = (e) => {
                const { name, value } = e.target;
                setModositandoJatekos(prev => ({
                        ...prev,
                        [name]: value
                }));
        };

        const JatekosModositas = async () => {
                if (!modositandoJatekos.foci_jatekos_nev) {
                        Swal.fire({
                                icon: 'warning',
                                title: 'Hiányzó adat',
                                text: 'Kérlek töltsd ki legalább a játékos nevét!',
                                confirmButtonText: 'OK'
                        });
                        return;
                }

                const megerosites = window.confirm(`Biztos, hogy módosítani szeretnéd a játékos adatait?`);
                if (!megerosites) return;

                try {
                        const response = await fetch(`${Cim.Cim}/fociJatekosAdatModosit/${modositandoJatekos.foci_jatekos_id}`, {
                                method: 'PUT',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                        foci_jatekos_nev: modositandoJatekos.foci_jatekos_nev,
                                        foci_jatekos_ertekeles: modositandoJatekos.foci_jatekos_ertekeles,
                                        foci_jatekos_piaci_ertek: modositandoJatekos.foci_jatekos_piaci_ertek,
                                        foci_jatekos_eletkor: modositandoJatekos.foci_jatekos_eletkor
                                }),
                        });

                        if (response.ok) {
                                Swal.fire({
                                        icon: 'success',
                                        title: 'Sikeres módosítás',
                                        text: 'A játékos adatai sikeresen módosítva!',
                                        confirmButtonText: 'OK'
                                });
                                ModositasFeluletBezaras();
                                leToltes();
                        } else {
                                const error = await response.json();
                                Swal.fire({
                                        icon: 'error',
                                        title: 'Hiba',
                                        text: `Hiba történt: ${error.error}`,
                                        confirmButtonText: 'OK'
                                });
                        }
                } catch (error) {
                        console.error('Hiba történt a módosítás során:', error);
                        Swal.fire({
                                icon: 'error',
                                title: 'Hiba',
                                text: 'Hiba történt a módosítás során!',
                                confirmButtonText: 'OK'
                        });
                }
        };

        // Törlés
        const JatekosTorles = async (jatekos) => {
                const megerosites = window.confirm(`Biztos, hogy törölni szeretnéd a következő játékost: ${jatekos.foci_jatekos_nev}?`);
                if (!megerosites) return;

                try {
                        const response = await fetch(`${Cim.Cim}/fociJatekosTorles/${jatekos.foci_jatekos_id}`, {
                                method: 'DELETE',
                        });

                        if (response.ok) {
                                Swal.fire({
                                        icon: 'success',
                                        title: 'Sikeres törlés',
                                        text: 'A játékos sikeresen törölve!',
                                        confirmButtonText: 'OK'
                                });
                                leToltes();
                        } else {
                                const error = await response.json();
                                Swal.fire({
                                        icon: 'error',
                                        title: 'Hiba',
                                        text: `Hiba történt: ${error.error}`,
                                        confirmButtonText: 'OK'
                                });
                        }
                } catch (error) {
                        console.error('Hiba történt a törlés során:', error);
                        Swal.fire({
                                icon: 'error',
                                title: 'Hiba',
                                text: 'Hiba történt a törlés során!',
                                confirmButtonText: 'OK'
                        });
                }
        };

        const JatekosTorlesModositasFeluletrol = async () => {
                const megerosites = window.confirm(`Biztos, hogy törölni szeretnéd a következő játékost: ${modositandoJatekos.foci_jatekos_nev}?`);
                if (!megerosites) return;

                try {
                        const response = await fetch(`${Cim.Cim}/fociJatekosTorles/${modositandoJatekos.foci_jatekos_id}`, {
                                method: 'DELETE',
                        });

                        if (response.ok) {
                                Swal.fire({
                                        icon: 'success',
                                        title: 'Sikeres törlés',
                                        text: 'A játékos sikeresen törölve!',
                                        confirmButtonText: 'OK'
                                });
                                ModositasFeluletBezaras();
                                leToltes();
                        } else {
                                const error = await response.json();
                                Swal.fire({
                                        icon: 'error',
                                        title: 'Hiba',
                                        text: `Hiba történt: ${error.error}`,
                                        confirmButtonText: 'OK'
                                });
                        }
                } catch (error) {
                        console.error('Hiba történt a törlés során:', error);
                        Swal.fire({
                                icon: 'error',
                                title: 'Hiba',
                                text: 'Hiba történt a törlés során!',
                                confirmButtonText: 'OK'
                        });
                }
        };

        // Piaci érték formázása millióban (pl. 65m)
        const formatMillio = (ertek) => {
                if (ertek === null || ertek === undefined || ertek === "") return "-";
                const szam = Number(ertek);
                if (isNaN(szam)) return ertek;
                return szam >= 1000000 ? `${Math.round(szam / 1000000)}m` : szam;
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
                                                        <h3>Játékos adatainak módosítása</h3>
                                  <button className="bezaras-gomb" onClick={ModositasFeluletBezaras}>×</button>
                                </div>
                                <div className="modal-test">
                                                        <div className="input-csoport">
                                                                <label>Név:</label>
                                                                <input type="text" name="foci_jatekos_nev" value={modositandoJatekos.foci_jatekos_nev} onChange={InputValtozas} placeholder="Játékos neve" />
                                                        </div>
                                                        <div className="input-csoport">
                                                                <label>Értékelés:</label>
                                                                <input type="number" name="foci_jatekos_ertekeles" value={modositandoJatekos.foci_jatekos_ertekeles} onChange={InputValtozas} placeholder="Pl.: 7.5" step="0.1" />
                                                        </div>
                                                        <div className="input-csoport">
                                                                <label>Piaci érték:</label>
                                                                <input type="number" name="foci_jatekos_piaci_ertek" value={modositandoJatekos.foci_jatekos_piaci_ertek} onChange={InputValtozas} placeholder="Pl.: 1000000" />
                                                        </div>
                                                        <div className="input-csoport">
                                                                <label>Életkor:</label>
                                                                <input type="number" name="foci_jatekos_eletkor" value={modositandoJatekos.foci_jatekos_eletkor} onChange={InputValtozas} placeholder="Életkor" />
                                                        </div>
                                </div>
                                <div className="modal-lablelc">
                                                        <button className="admin-button" onClick={JatekosModositas}>Módosítások mentése</button>
                                                        <button className="admin-button torles" style={{backgroundColor: '#dc3545'}} onClick={JatekosTorlesModositasFeluletrol}>Törlés</button>
                                  <button className="admin-button visszavon" onClick={ModositasFeluletBezaras}>Mégsem</button>
                                </div>
                          </div>
                        </div>
                  )}

                        {ujJatekFelulet && (
                        <div className="modal-hatter">
                          <div className="modal-tartalom">
                                <div className="modal-fejlec">
                                            <h3>Új játékos hozzáadása</h3>
                                            <button className="bezaras-gomb" onClick={UjJatekosFeluletBezaras}>×</button>
                                </div>
                                <div className="modal-test">
                                            <div className="input-csoport">
                                                    <label>Név:</label>
                                                    <input type="text" name="foci_jatekos_nev" value={ujJatekos.foci_jatekos_nev} onChange={UjJatekosInputValtozas} placeholder="Játékos neve" />
                                            </div>
                                            <div className="input-csoport">
                                                    <label>Értékelés:</label>
                                                    <input type="number" name="foci_jatekos_ertekeles" value={ujJatekos.foci_jatekos_ertekeles} onChange={UjJatekosInputValtozas} placeholder="Pl.: 7.5" step="0.1" />
                                            </div>
                                            <div className="input-csoport">
                                                    <label>Piaci érték:</label>
                                                    <input type="number" name="foci_jatekos_piaci_ertek" value={ujJatekos.foci_jatekos_piaci_ertek} onChange={UjJatekosInputValtozas} placeholder="Pl.: 1000000" />
                                            </div>
                                            <div className="input-csoport">
                                                    <label>Életkor:</label>
                                                    <input type="number" name="foci_jatekos_eletkor" value={ujJatekos.foci_jatekos_eletkor} onChange={UjJatekosInputValtozas} placeholder="Életkor" />
                                            </div>
                                </div>
                                <div className="modal-lablelc">
                                            <button className="admin-button" onClick={UjJatekosHozzaadas}>Játékos hozzáadása</button>
                                            <button className="admin-button visszavon" onClick={UjJatekosFeluletBezaras}>Mégsem</button>
                                </div>
                          </div>
                        </div>
                  )}

                  <div className="container">
                                                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                                                                        <h2 style={{ margin: 0 }}>Foci játékosok kezelése</h2>
                                                                                                        <button className="admin-button" onClick={UjJatekosFeluletMegnyitas}>Új játékos hozzáadása</button>
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
                                                    <th>Név</th>
                                                    <th>Értékelés</th>
                                                    <th>Piaci érték</th>
                                                    <th>Életkor</th>
                                                    <th>Műveletek</th>
                                            </tr>                          </thead>
                          <tbody>
                            {jelenlegiJatekosok.length > 0 ? (
                                    jelenlegiJatekosok.map((elem,index)=>(
                                        <tr key={elem.foci_jatekos_id || index} className="adat-sor">
                                                <td>{keresesSzoveg.trim() ? elem.foci_jatekos_id : kezdoIndex + index + 1}</td>
                                                <td className="orszag-nev">{elem.foci_jatekos_nev}</td>
                                                <td className="szam-adat">{elem.foci_jatekos_ertekeles ?? '-'}</td>
                                                <td className="szam-adat">{formatMillio(elem.foci_jatekos_piaci_ertek)}</td>
                                                <td className="szam-adat">{elem.foci_jatekos_eletkor ?? '-'}</td>
                                                <td><button className="torles-gomb" onClick={() => ModositasFeluletMegnyitas(elem)}>Szerkesztés</button></td>
                                        </tr>
                                    ))
                            ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                                {keresesSzoveg.trim() ? 'Nincs találat a keresési feltételre' : 'Nincs megjeleníthető adat'}
                                        </td>
                                    </tr>
                            )}
                          </tbody>
                          </table>
                        </div>

                        {osszesOldal > 1 && (
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <button 
                                                className="admin-button" 
                                                onClick={elozoOldal} 
                                                disabled={jelenlegiOldal === 1}
                                                style={{ opacity: jelenlegiOldal === 1 ? 0.5 : 1 }}
                                        >
                                                ← Előző
                                        </button>
                                        
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                {[...Array(osszesOldal)].map((_, index) => {
                                                        const oldalSzam = index + 1;
                                                        // Show first page, last page, current page, and pages around current
                                                        if (
                                                                oldalSzam === 1 || 
                                                                oldalSzam === osszesOldal || 
                                                                (oldalSzam >= jelenlegiOldal - 1 && oldalSzam <= jelenlegiOldal + 1)
                                                        ) {
                                                                return (
                                                                        <button
                                                                                key={oldalSzam}
                                                                                className="admin-button"
                                                                                onClick={() => ugrasoldalra(oldalSzam)}
                                                                                style={{
                                                                                        backgroundColor: jelenlegiOldal === oldalSzam ? '#0066cc' : '#28a745',
                                                                                        minWidth: '40px'
                                                                                }}
                                                                        >
                                                                                {oldalSzam}
                                                                        </button>
                                                                );
                                                        } else if (
                                                                oldalSzam === jelenlegiOldal - 2 || 
                                                                oldalSzam === jelenlegiOldal + 2
                                                        ) {
                                                                return <span key={oldalSzam} style={{ padding: '0 5px' }}>...</span>;
                                                        }
                                                        return null;
                                                })}
                                        </div>

                                        <button 
                                                className="admin-button" 
                                                onClick={kovetkezoOldal} 
                                                disabled={jelenlegiOldal === osszesOldal}
                                                style={{ opacity: jelenlegiOldal === osszesOldal ? 0.5 : 1 }}
                                        >
                                                Következő →
                                        </button>
                                        
                                        <span style={{ marginLeft: '15px', color: '#666' }}>
                                                {jelenlegiOldal}. oldal / {osszesOldal}
                                        </span>
                                </div>
                        )}

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                          <button className="admin-button" onClick={() => window.history.back()}>Visszatérés az adminfelületre</button>
                        </div>
                  </div>
                </div>
        )
}
export default FociJatekModosit;
