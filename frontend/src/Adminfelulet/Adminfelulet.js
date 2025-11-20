import Adminfelulet from "./Adminfelulet.css"
import { useState,useEffect } from "react"
import Cim from "../Cim"

const JatekTorles=({kivalasztott})=>{
    const [adatok,setAdatok]=useState([])
    const [tolt,setTolt]=useState(true)
    const [hiba,setHiba]=useState(false)

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

    // --------------------- Városok betöltésének folyamata ----------------- //

    const JatekTorles=async(jatek_id,jatekNev)=>{
        const megerosites = window.confirm(`Biztos, hogy törölni szeretnéd a(z) "${jatekNev}" játékot? ${jatek_id}`);
        
        if (!megerosites) {
            return;
        }

        try {
            const response = await fetch(`${Cim.Cim}/jatekTorles/${jatek_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();
                leToltes();
            } else {
                const error = await response.json();
                alert(`Hiba történt: ${error.error}`);
            }
        } catch (error) {
            console.log(error);
            alert('Hiba történt a törlés során!');
        }
    }

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Városok</h2>
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
                            <td><button className="torles-gomb" onClick={() => JatekTorles(elem.jatek_id, elem.jatek_nev)}>Adatmódosítás</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default JatekTorles
