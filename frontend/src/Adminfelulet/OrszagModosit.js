import "./AdminStyles.css"
import { useState,useEffect } from "react"
import Cim from "../Cim"
import Swal from 'sweetalert2'

const OrszagModosit=({kivalasztott})=>{
    const [adatok,setAdatok]=useState([])
    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)
    const [modositasFelulet, setModositasFelulet] = useState(false)
    const [ujOrszagFelulet, setUjOrszagFelulet] = useState(false)
    const [keresesSzoveg, setKeresesSzoveg] = useState('')
    const [keresesEredmeny, setKeresesEredmeny] = useState([])
    const [keresEsben, setKeresEsben] = useState(false)
    const [jelenlegiOldal, setJelenlegiOldal] = useState(1)
    const [oldalMeret] = useState(20)
    const [modositandoOrszag, setModositandoOrszag] = useState({
        orszag_id: '',
        orszag_nev: '',
        orszag_nepesseg: '',
        orszag_nagysag: '',
        orszag_gdp: ''
    })
    const [ujOrszag, setUjOrszag] = useState({
        orszag_nev: '',
        orszag_nepesseg: '',
        orszag_nagysag: '',
        orszag_gdp: ''
    })

    const leToltes=async ()=>{
        setTolt(true) // Betöltés állapot beállítása
        setHiba(false) // Hiba állapot visszaállítása
        
        try{
            const response=await fetch(Cim.Cim+"/orszagAdatBetolt")
            
            if (response.ok) {
                const data=await response.json()
                console.log("Betöltött országok száma:", data.length)
                console.log("Országok:", data)
                setAdatok(data)
                setTolt(false)
            } else {
                console.error("Szerver hiba:", response.status, response.statusText)
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

    // --------------------- Keresés funkció ----------------- //

    const keresesVegrehajtas = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setKeresesEredmeny([]);
            return;
        }

        setKeresEsben(true);
        
        try {
            const response = await fetch(`${Cim.Cim}/orszagKereses/${encodeURIComponent(searchTerm)}`);
            
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
        
        // Debounced search - keressen 300ms késleltetéssel
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

    // Meghatározzuk, hogy melyik adatokat jelenítjük meg (keresési eredmény vagy teljes lista)
    const megjelenitoAdatok = keresesSzoveg.trim() ? keresesEredmeny : adatok;

    // Pagination számítások
    const osszesOldal = Math.ceil(megjelenitoAdatok.length / oldalMeret);
    const kezdoIndex = (jelenlegiOldal - 1) * oldalMeret;
    const vegIndex = kezdoIndex + oldalMeret;
    const jelenlegiOrszagok = megjelenitoAdatok.slice(kezdoIndex, vegIndex);

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

    // --------------------- Új ország hozzáadásának folyamata ----------------- //

    const UjOrszagFeluletMegnyitas = () => {
        setUjOrszag({
            orszag_nev: '',
            orszag_nepesseg: '',
            orszag_nagysag: '',
            orszag_gdp: ''
        });
        setUjOrszagFelulet(true);
    };

    const UjOrszagFeluletBezaras = () => {
        setUjOrszagFelulet(false);
        setUjOrszag({
            orszag_nev: '',
            orszag_nepesseg: '',
            orszag_nagysag: '',
            orszag_gdp: ''
        });
    };

    const UjOrszagInputValtozas = (e) => {
        const { name, value } = e.target;
        setUjOrszag(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const UjOrszagHozzaadas = async () => {
        if (!ujOrszag.orszag_nev || !ujOrszag.orszag_nepesseg || 
            !ujOrszag.orszag_nagysag || !ujOrszag.orszag_gdp) {
            Swal.fire({
                icon: 'warning',
                title: 'Hiányzó adatok',
                text: 'Kérlek töltsd ki az összes mezőt!',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await fetch(`${Cim.Cim}/ujOrszagFelvitele`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ujOrszag),
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Sikeres hozzáadás',
                    text: 'Új ország sikeresen hozzáadva!',
                    confirmButtonText: 'OK'
                });
                UjOrszagFeluletBezaras();
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
            console.error('Hiba történt az ország hozzáadása során:', error);
            Swal.fire({
                icon: 'error',
                title: 'Hiba',
                text: 'Hiba történt az ország hozzáadása során!',
                confirmButtonText: 'OK'
            });
        }
    };

    // --------------------- Országok módosításának folyamata ----------------- //

    const ModositasFeluletMegnyitas = (orszag) => {
        setModositandoOrszag({
            orszag_id: orszag.orszag_id,
            orszag_nev: orszag.orszag_nev,
            orszag_nepesseg: orszag.orszag_nepesseg,
            orszag_nagysag: orszag.orszag_nagysag,
            orszag_gdp: orszag.orszag_gdp
        });
        setModositasFelulet(true);
    };

    const ModositasFeluletBezaras = () => {
        setModositasFelulet(false);
        setModositandoOrszag({
            orszag_id: '',
            orszag_nev: '',
            orszag_nepesseg: '',
            orszag_nagysag: '',
            orszag_gdp: ''
        });
    };

    const InputValtozas = (e) => {
        const { name, value } = e.target;
        setModositandoOrszag(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const OrszagModositas = async () => {
        if (!modositandoOrszag.orszag_nev || !modositandoOrszag.orszag_nepesseg || 
            !modositandoOrszag.orszag_nagysag || !modositandoOrszag.orszag_gdp) {
            Swal.fire({
                icon: 'warning',
                title: 'Hiányzó adatok',
                text: 'Kérlek töltsd ki az összes mezőt!',
                confirmButtonText: 'OK'
            });
            return;
        }

        const megerosites = window.confirm(`Biztos, hogy módosítani szeretnéd a(z) "${modositandoOrszag.orszag_nev}" ország adatait?`);

        if (!megerosites) {
            return;
        }

        try {
            const response = await fetch(`${Cim.Cim}/orszagAdatModosit/${modositandoOrszag.orszag_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orszag_nev: modositandoOrszag.orszag_nev,
                    orszag_nepesseg: modositandoOrszag.orszag_nepesseg,
                    orszag_nagysag: modositandoOrszag.orszag_nagysag,
                    orszag_gdp: modositandoOrszag.orszag_gdp,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Sikeres módosítás',
                    text: 'Az ország adatai sikeresen módosítva!',
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

    // Ország törlése
    const OrszagTorles = async (orszag) => {
        const megerosites = window.confirm(`Biztos, hogy törölni szeretnéd a következő országot: ${orszag.orszag_nev}?`);
        if (!megerosites) return;

        try {
            const response = await fetch(`${Cim.Cim}/orszagTorles/${orszag.orszag_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sikeres törlés',
                    text: 'Az ország sikeresen törölve!',
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

    const OrszagTorlesModositasFeluletrol = async () => {
        const megerosites = window.confirm(`Biztos, hogy törölni szeretnéd a következő országot: ${modositandoOrszag.orszag_nev}?`);
        if (!megerosites) return;

        try {
            const response = await fetch(`${Cim.Cim}/orszagTorles/${modositandoOrszag.orszag_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sikeres törlés',
                    text: 'Az ország sikeresen törölve!',
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

    // --------------------- Tartalom ----------------- //

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
          {/* Módosítás Modal */}
          {modositasFelulet && (
            <div className="modal-hatter">
              <div className="modal-tartalom">
                <div className="modal-fejlec">
                  <h3>Ország adatainak módosítása</h3>
                  <button className="bezaras-gomb" onClick={ModositasFeluletBezaras}>×</button>
                </div>
                <div className="modal-test">
                  <div className="input-csoport">
                    <label>Ország neve:</label>
                    <input
                      type="text"
                      name="orszag_nev"
                      value={modositandoOrszag.orszag_nev}
                      onChange={InputValtozas}
                      placeholder="Ország neve"
                    />
                  </div>
                  <div className="input-csoport">
                    <label>Népessége:</label>
                    <input
                      type="number"
                      name="orszag_nepesseg"
                      value={modositandoOrszag.orszag_nepesseg}
                      onChange={InputValtozas}
                      placeholder="Népessége"
                    />
                  </div>
                  <div className="input-csoport">
                    <label>Nagysága (km²):</label>
                    <input
                      type="number"
                      name="orszag_nagysag"
                      value={modositandoOrszag.orszag_nagysag}
                      onChange={InputValtozas}
                      placeholder="Nagysága km²-ben"
                    />
                  </div>
                  <div className="input-csoport">
                    <label>GDP (millió $):</label>
                    <input
                      type="number"
                      name="orszag_gdp"
                      value={modositandoOrszag.orszag_gdp}
                      onChange={InputValtozas}
                      placeholder="GDP millió dollárban"
                    />
                  </div>
                </div>
                <div className="modal-lablelc">
                  <button className="admin-button" onClick={OrszagModositas}>
                    Módosítások mentése
                  </button>
                  <button className="admin-button torles" style={{backgroundColor: '#dc3545'}} onClick={OrszagTorlesModositasFeluletrol}>Törlés</button>
                  <button className="admin-button visszavon" onClick={ModositasFeluletBezaras}>
                    Mégsem
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Új ország hozzáadása Modal */}
          {ujOrszagFelulet && (
            <div className="modal-hatter">
              <div className="modal-tartalom">
                <div className="modal-fejlec">
                  <h3>Új ország hozzáadása</h3>
                  <button className="bezaras-gomb" onClick={UjOrszagFeluletBezaras}>×</button>
                </div>
                <div className="modal-test">
                  <div className="input-csoport">
                    <label>Ország neve:</label>
                    <input
                      type="text"
                      name="orszag_nev"
                      value={ujOrszag.orszag_nev}
                      onChange={UjOrszagInputValtozas}
                      placeholder="Ország neve"
                    />
                  </div>
                  <div className="input-csoport">
                    <label>Népessége:</label>
                    <input
                      type="number"
                      name="orszag_nepesseg"
                      value={ujOrszag.orszag_nepesseg}
                      onChange={UjOrszagInputValtozas}
                      placeholder="Népessége"
                    />
                  </div>
                  <div className="input-csoport">
                    <label>Nagysága (km²):</label>
                    <input
                      type="number"
                      name="orszag_nagysag"
                      value={ujOrszag.orszag_nagysag}
                      onChange={UjOrszagInputValtozas}
                      placeholder="Nagysága km²-ben"
                    />
                  </div>
                  <div className="input-csoport">
                    <label>GDP (millió $):</label>
                    <input
                      type="number"
                      name="orszag_gdp"
                      value={ujOrszag.orszag_gdp}
                      onChange={UjOrszagInputValtozas}
                      placeholder="GDP millió dollárban"
                    />
                  </div>
                </div>
                <div className="modal-lablelc">
                  <button className="admin-button" onClick={UjOrszagHozzaadas}>
                    Ország hozzáadása
                  </button>
                  <button className="admin-button visszavon" onClick={UjOrszagFeluletBezaras}>
                    Mégsem
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Országok kezelése</h2>
              <button className="admin-button" onClick={UjOrszagFeluletMegnyitas}>Új ország hozzáadása</button>
            </div>
            
            {/* Keresőmező */}
            <div className="kereses-container">
              <div className="kereses-input-csoport">
                <input
                  type="text"
                  className="kereses-input"
                  placeholder="Keresés országnév vagy ID alapján..."
                  value={keresesSzoveg}
                  onChange={keresesInputValtozas}
                />
                {keresesSzoveg && (
                  <button className="kereses-torles" onClick={keresesTorles}>
                    ×
                  </button>
                )}
                {keresEsben && (
                  <div className="kereses-loading">🔍</div>
                )}
              </div>
              {keresesSzoveg && (
                <div className="kereses-info">
                  {keresesEredmeny.length > 0 
                    ? `${keresesEredmeny.length} találat` 
                    : 'Nincs találat'
                  }
                </div>
              )}
            </div>
            
            <div className="table-container">
              <table className="adat-tablazat">
                  <thead>
                      <tr>
                        <th className="index-column" style={{textAlign: 'center'}}>#</th>
                          <th style={{textAlign: 'left'}}>Ország</th>
                          <th style={{textAlign: 'right'}}>Népessége</th>
                          <th style={{textAlign: 'right'}}>Nagysága (km²)</th>
                          <th style={{textAlign: 'right'}}>GDP (millió $)</th>
                          <th style={{textAlign: 'center'}}>Műveletek</th>
                      </tr>
                  </thead>
                  <tbody>
                      {jelenlegiOrszagok.length > 0 ? (
                        jelenlegiOrszagok.map((elem,index)=>(
                            <tr key={elem.orszag_id} className="adat-sor">
                                <td style={{textAlign: 'center'}}>{keresesSzoveg.trim() ? elem.orszag_id : kezdoIndex + index + 1}</td>
                                <td className="orszag-nev" style={{textAlign: 'left'}}>{elem.orszag_nev}</td>
                                <td className="szam-adat" style={{textAlign: 'right'}}>{elem.orszag_nepesseg.toLocaleString()} fő</td>
                                <td className="szam-adat" style={{textAlign: 'right'}}>{elem.orszag_nagysag.toLocaleString()} km²</td>
                                <td className="szam-adat" style={{textAlign: 'right'}}>{elem.orszag_gdp.toLocaleString()} M$</td>
                                <td style={{textAlign: 'center'}}><button className="torles-gomb" onClick={() => ModositasFeluletMegnyitas(elem)}>Szerkesztés</button></td>
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
export default OrszagModosit;
