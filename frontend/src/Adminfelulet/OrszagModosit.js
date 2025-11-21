import Admin from "./Admin.css"
import { useState,useEffect } from "react"
import Cim from "../Cim"

const OrszagModosit=({kivalasztott})=>{
    const [adatok,setAdatok]=useState([])
    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)
    const [modositasFelulet, setModositasFelulet] = useState(false)
    const [ujOrszagFelulet, setUjOrszagFelulet] = useState(false)
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
            alert('Kérlek töltsd ki az összes mezőt!');
            return;
        }

        try {
            const response = await fetch(`${Cim.Cim}/ujOrszagFelvitele`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orszag_nev: ujOrszag.orszag_nev,
                    orszag_nepesseg: ujOrszag.orszag_nepesseg,
                    orszag_nagysag: ujOrszag.orszag_nagysag,
                    orszag_gdp: ujOrszag.orszag_gdp,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Új ország sikeresen hozzáadva!');
                UjOrszagFeluletBezaras();
                leToltes();
            } else {
                const error = await response.json();
                alert(`Hiba történt: ${error.error}`);
            }
        } catch (error) {
            console.error('Hiba történt az ország hozzáadása során:', error);
            alert('Hiba történt az ország hozzáadása során!');
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
            alert('Kérlek töltsd ki az összes mezőt!');
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
                alert('Az ország adatai sikeresen módosítva!');
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Városok</h2>
            <button className="admin-button" onClick={UjOrszagFeluletMegnyitas}>Új ország hozzáadása</button>
          </div>
            <table className="adat-tablazat">
                <thead>
                    <tr>
                      <th className="index-column">#</th>
                        <th>Ország</th>
                        <th>Népessége</th>
                        <th>Nagysága (km²)</th>
                        <th>GDP (millió $)</th>
                        <th>Adatmódosítás</th>
                    </tr>
                </thead>
                <tbody>
                    {adatok.map((elem,index)=>(
                        <tr key={index} className="adat-sor">
                            <td>{index + 1}</td>
                            <td>{elem.orszag_nev}</td>
                            <td>{elem.orszag_nepesseg} Fő</td>
                            <td>{elem.orszag_nagysag} km²</td>
                            <td>{elem.orszag_gdp} millió $</td>
                            <td><button className="torles-gomb" onClick={() => ModositasFeluletMegnyitas(elem)}>Adatmódosítás</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="admin-button" onClick={() => window.history.back()}>Visszatérés az adminfelületre</button>
        </div>
    )
}
export default OrszagModosit;
