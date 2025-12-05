import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cim from '../../Cim';
import './FC26ErtekelesStyles.css';

const FC26Ertekeles = () => {
    const navigate = useNavigate();
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
        const mentettLegjobb = localStorage.getItem('legjobPontszam');
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
<<<<<<< HEAD
                // Szűrjük ki azokat, akiknek van FC26 értékelése és csak az első 76-ot töltsük be
                const szurtData = data.filter(j => j.foci_jatekos_ertekeles && j.foci_jatekos_ertekeles > 0).slice(0, 146);
=======
                // Szűrjük ki azokat, akiknek van FC26 értékelése és ID 1-76 között van
                const szurtData = data.filter(j => 
                    j.foci_jatekos_ertekeles && 
                    j.foci_jatekos_ertekeles > 0 && 
                    j.foci_jatekos_id >= 1 && 
                    j.foci_jatekos_id <= 76
                );
>>>>>>> af4dc2041c9c2f5ea855c62bd90ff734bd4e55d1
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
        
        const aktualisErtek = parseFloat(aktualisJatekos.foci_jatekos_ertekeles);
        const kovetkezoErtek = parseFloat(kovetkezoJatekos.foci_jatekos_ertekeles);
        
        // Ha az aktuális játékosra kattintottak, azt gondolják, hogy ő a nagyobb
        // Ha a következő játékosra kattintottak, azt gondolják, hogy ő a nagyobb
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
                    localStorage.setItem('legjobPontszam', ujPontszam.toString());
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
        return parseInt(ertek);
    };

    if (tolt) {
        return (
            <div className="fc26-container">
                <div className="loading">Betöltés...</div>
            </div>
        );
    }

    if (hiba) {
        return (
            <div className="fc26-container">
                <div className="error">Hiba történt az adatok betöltése közben!</div>
            </div>
        );
    }

    if (jatekVege) {
        return (
            <div className="fc26-container">
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
            <div className="fc26-container">
                <div className="error">Nincs elég játékos az adatbázisban!</div>
            </div>
        );
    }

    return (
        <div className="fc26-container">
            <button className="back-button" onClick={() => navigate('/temavalasztas', { state: { selectedTheme: 'Foci' } })}>
                <span className="back-arrow">←</span> Vissza
            </button>
            <div className="game-header">
                <h1>Higher or Lower - FC26 Értékelés</h1>
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
<<<<<<< HEAD
                    <div className="player-image-container">
                        <img 
                            src={require(`../Kepek/${aktualisJatekos.foci_jatekos_id}.jpg`)}
                            alt={aktualisJatekos.foci_jatekos_nev}
                            className="player-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.padding = '20px';
                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d1117"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/><circle cx="12" cy="12" r="1.5" fill="%23fbbf24"/><path d="M12 8l-1.5 2.5h3L12 8zm-3 6l1.5-2.5-1.5-2.5-1.5 2.5L9 14zm6 0l-1.5-2.5 1.5-2.5 1.5 2.5L15 14z" fill="%23fbbf24" opacity="0.7"/></svg>';
                            }}
=======
                    <div className="player-image">
                        <img 
                            src={require(`../Kepek/${aktualisJatekos.foci_jatekos_id}.jpg`)} 
                            alt={aktualisJatekos.foci_jatekos_nev}
                            onError={(e) => {e.target.style.display = 'none'}}
>>>>>>> af4dc2041c9c2f5ea855c62bd90ff734bd4e55d1
                        />
                    </div>
                    <div className="player-info">
                        <h2>{aktualisJatekos.foci_jatekos_nev}</h2>
                        <div className="player-value">
                            <h3>FC26 Értékelés</h3>
                            <p className="value">{formatErtek(aktualisJatekos.foci_jatekos_ertekeles)}</p>
                        </div>
                    </div>
                    {!megmutat && !jatekVege && (
                        <div className="click-hint">Kattints, ha ez a nagyobb!</div>
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
<<<<<<< HEAD
                    <div className="player-image-container">
                        <img 
                            src={require(`../Kepek/${kovetkezoJatekos.foci_jatekos_id}.jpg`)}
                            alt={kovetkezoJatekos.foci_jatekos_nev}
                            className="player-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.padding = '20px';
                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d1117"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/><circle cx="12" cy="12" r="1.5" fill="%23fbbf24"/><path d="M12 8l-1.5 2.5h3L12 8zm-3 6l1.5-2.5-1.5-2.5-1.5 2.5L9 14zm6 0l-1.5-2.5 1.5-2.5 1.5 2.5L15 14z" fill="%23fbbf24" opacity="0.7"/></svg>';
                            }}
=======
                    <div className="player-image">
                        <img 
                            src={require(`../Kepek/${kovetkezoJatekos.foci_jatekos_id}.jpg`)} 
                            alt={kovetkezoJatekos.foci_jatekos_nev}
                            onError={(e) => {e.target.style.display = 'none'}}
>>>>>>> af4dc2041c9c2f5ea855c62bd90ff734bd4e55d1
                        />
                    </div>
                    <div className="player-info">
                        <h2>{kovetkezoJatekos.foci_jatekos_nev}</h2>
                        <div className="player-value">
                            <h3>FC26 Értékelés</h3>
                            {megmutat ? (
                                <p className="value revealed">{formatErtek(kovetkezoJatekos.foci_jatekos_ertekeles)}</p>
                            ) : (
                                <p className="value hidden">???</p>
                            )}
                        </div>
                    </div>
                    {!megmutat && !jatekVege && (
                        <div className="click-hint">Kattints, ha ez a nagyobb!</div>
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

export default FC26Ertekeles;
