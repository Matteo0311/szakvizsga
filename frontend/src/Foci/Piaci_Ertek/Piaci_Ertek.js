import React, { useState, useEffect } from 'react';
import Cim from '../../Cim';
import './Piaci_ErtekStyles.css';

const Piaci_Ertek = () => {
    const [jatekosok, setJatekosok] = useState([]);
    const [aktualisJatekos, setAktualisJatekos] = useState(null);
    const [kovetkezoJatekos, setKovetkezoJatekos] = useState(null);
    const [pontszam, setPontszam] = useState(0);
    const [legjobPontszam, setLegjobPontszam] = useState(0);
    const [jatekVege, setJatekVege] = useState(false);
    const [tolt, setTolt] = useState(true);
    const [hiba, setHiba] = useState(false);
    const [megmutat, setMegmutat] = useState(false);
    const [animacio, setAnimacio] = useState('');
    const [hasznaltJatekosok, setHashnaltJatekosok] = useState([]);

    useEffect(() => {
        jatekosokBetoltese();
        const mentettLegjobb = localStorage.getItem('legjobPontszamPiaci');
        if (mentettLegjobb) {
            setLegjobPontszam(parseInt(mentettLegjobb));
        }
    }, []);

    const jatekosokBetoltese = async () => {
        setTolt(true);
        setHiba(false);
        try {
            const response = await fetch(Cim.Cim + "/fociJatekosAdatBetolt");
            if (response.ok) {
                const data = await response.json();
                // Szűrjük ki azokat, akiknek van piaci értéke
                const szurtData = data.filter(j => j.foci_jatekos_piaci_ertek && j.foci_jatekos_piaci_ertek > 0);
                setJatekosok(szurtData);
                
                if (szurtData.length >= 2) {
                    ujJatekInditasa(szurtData);
                }
                setTolt(false);
            } else {
                setHiba(true);
                setTolt(false);
            }
        } catch (error) {
            console.error("Fetch hiba:", error);
            setHiba(true);
            setTolt(false);
        }
    };

    const ujJatekInditasa = (jatekosLista = jatekosok) => {
        if (jatekosLista.length < 2) return;
        
        const keverett = [...jatekosLista].sort(() => Math.random() - 0.5);
        setAktualisJatekos(keverett[0]);
        setKovetkezoJatekos(keverett[1]);
        setHashnaltJatekosok([keverett[0].foci_jatekos_id, keverett[1].foci_jatekos_id]);
        setPontszam(0);
        setJatekVege(false);
        setMegmutat(false);
        setAnimacio('');
    };

    const ujJatekosValasztas = (jatekosLista = jatekosok) => {
        const elerheto = jatekosLista.filter(j => !hasznaltJatekosok.includes(j.foci_jatekos_id));
        
        if (elerheto.length === 0) {
            // Ha elfogytak a játékosok, újrakezdhetjük
            setHashnaltJatekosok([]);
            return jatekosLista[Math.floor(Math.random() * jatekosLista.length)];
        }
        
        return elerheto[Math.floor(Math.random() * elerheto.length)];
    };

    const tippelés = (valasztottJatekos) => {
        if (megmutat || jatekVege) return;

        setMegmutat(true);
        
        const aktualisErtek = parseFloat(aktualisJatekos.foci_jatekos_piaci_ertek);
        const kovetkezoErtek = parseFloat(kovetkezoJatekos.foci_jatekos_piaci_ertek);
        
        // Ha az aktuális játékosra kattintottak, azt gondolják, hogy ő az értékesebb
        // Ha a következő játékosra kattintottak, azt gondolják, hogy ő az értékesebb
        let helyes = false;
        if (valasztottJatekos === 'aktual' && aktualisErtek >= kovetkezoErtek) {
            helyes = true;
        } else if (valasztottJatekos === 'kovetkezo' && kovetkezoErtek >= aktualisErtek) {
            helyes = true;
        }

        if (helyes) {
            setAnimacio('helyes');
            setTimeout(() => {
                const ujPontszam = pontszam + 1;
                setPontszam(ujPontszam);
                
                if (ujPontszam > legjobPontszam) {
                    setLegjobPontszam(ujPontszam);
                    localStorage.setItem('legjobPontszamPiaci', ujPontszam.toString());
                }
                
                // Következő kör
                setAktualisJatekos(kovetkezoJatekos);
                const ujJatekos = ujJatekosValasztas();
                setKovetkezoJatekos(ujJatekos);
                setHashnaltJatekosok([...hasznaltJatekosok, ujJatekos.foci_jatekos_id]);
                setMegmutat(false);
                setAnimacio('');
            }, 2000);
        } else {
            setAnimacio('helytelen');
            setTimeout(() => {
                setJatekVege(true);
            }, 2000);
        }
    };

    const formatErtek = (ertek) => {
        const szam = parseFloat(ertek);
        if (szam >= 1000000) {
            return (szam / 1000000).toFixed(1) + 'M';
        } else if (szam >= 1000) {
            return (szam / 1000).toFixed(0) + 'K';
        }
        return szam.toLocaleString('hu-HU');
    };

    if (tolt) {
        return (
            <div className="piaci-container">
                <div className="loading">Betöltés...</div>
            </div>
        );
    }

    if (hiba) {
        return (
            <div className="piaci-container">
                <div className="error">Hiba történt az adatok betöltése közben!</div>
            </div>
        );
    }

    if (jatekVege) {
        return (
            <div className="piaci-container">
                <div className="game-over">
                    <h1>Játék vége!</h1>
                    <div className="final-score">
                        <p>Pontszámod: <span className="score-number">{pontszam}</span></p>
                        <p>Legjobb eredmény: <span className="score-number">{legjobPontszam}</span></p>
                    </div>
                    <button className="restart-button" onClick={() => ujJatekInditasa()}>
                        Új játék
                    </button>
                </div>
            </div>
        );
    }

    if (!aktualisJatekos || !kovetkezoJatekos) {
        return (
            <div className="piaci-container">
                <div className="error">Nincs elég játékos az adatbázisban!</div>
            </div>
        );
    }

    return (
        <div className="piaci-container">
            <div className="game-header">
                <h1>Higher or Lower - Piaci Érték</h1>
                <div className="score-board">
                    <span className="current-score">Pontszám: {pontszam}</span>
                    <span className="best-score">Legjobb: {legjobPontszam}</span>
                </div>
            </div>

            <div className="game-content">
                <div 
                    className={`player-card current clickable ${animacio === 'helyes' ? 'correct' : animacio === 'helytelen' ? 'wrong' : ''} ${!megmutat && !jatekVege ? 'hoverable' : ''}`}
                    onClick={() => !megmutat && !jatekVege && tippelés('aktual')}
                    style={{ cursor: !megmutat && !jatekVege ? 'pointer' : 'default' }}
                >
                    <div className="player-info">
                        <h2>{aktualisJatekos.foci_jatekos_nev}</h2>
                        <div className="player-value">
                            <h3>Piaci Érték</h3>
                            <p className="value">{formatErtek(aktualisJatekos.foci_jatekos_piaci_ertek)} <span className="unit">€</span></p>
                        </div>
                    </div>
                    {!megmutat && !jatekVege && (
                        <div className="click-hint">Kattints, ha ez az értékesebb!</div>
                    )}
                </div>

                <div className="vs-section">
                    <div className="vs-text">VS</div>
                </div>

                <div 
                    className={`player-card next clickable ${animacio === 'helyes' ? 'correct' : animacio === 'helytelen' ? 'wrong' : ''} ${!megmutat && !jatekVege ? 'hoverable' : ''}`}
                    onClick={() => !megmutat && !jatekVege && tippelés('kovetkezo')}
                    style={{ cursor: !megmutat && !jatekVege ? 'pointer' : 'default' }}
                >
                    <div className="player-info">
                        <h2>{kovetkezoJatekos.foci_jatekos_nev}</h2>
                        <div className="player-value">
                            <h3>Piaci Érték</h3>
                            {megmutat ? (
                                <p className="value revealed">{formatErtek(kovetkezoJatekos.foci_jatekos_piaci_ertek)} <span className="unit">€</span></p>
                            ) : (
                                <p className="value hidden">???</p>
                            )}
                        </div>
                    </div>
                    {!megmutat && !jatekVege && (
                        <div className="click-hint">Kattints, ha ez az értékesebb!</div>
                    )}
                </div>
            </div>

            {megmutat && (
                <div className={`result-message ${animacio}`}>
                    {animacio === 'helyes' ? '✓ Helyes!' : '✗ Helytelen!'}
                </div>
            )}
        </div>
    );
};

export default Piaci_Ertek;
