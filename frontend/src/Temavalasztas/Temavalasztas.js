import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TemavalasztasStyles.css';
import { IoFootball } from 'react-icons/io5';
import { FaGlobeEurope, FaMusic } from 'react-icons/fa';

const themes = [
    {
        title: 'Foci',
        icon: IoFootball,
        desc: 'Foci játékos értékelés, életkor, piaci érték',
        subthemes: [
            { title: 'FC 26 játékos értékelés', desc: 'Melyik játékosnak nagyobb az FC 26 értékelése!' },
            { title: 'Játékos életkor', desc: 'Melyik játékos az idősebb?' },
            { title: 'Játékos piaci érték', desc: 'Melyik játékosnak nagyobb a piaci értéke?' }
        ],
    },
    {
        title: 'Országok',
        icon: FaGlobeEurope,
        desc: 'Népesség, terület, GDP',
        subthemes: [
            { title: 'Európa', desc: 'Európai országok' },
            { title: 'Világ', desc: 'Összes ország' },
        ],
    },
    {
        title: 'Zene',
        icon: FaMusic,
        desc: 'Előadók, számok',
        subthemes: [
            { title: 'Magyar', desc: 'Magyar előadók' },
            { title: 'Nemzetközi', desc: 'Külföldi előadók' },
        ],
    },
];

const Temavalasztas = () => {
    const [selectedTheme, setSelectedTheme] = useState(null);
    const navigate = useNavigate();

    const handleThemeClick = (theme) => {
        setSelectedTheme(theme);
    };

    const handleSubthemeClick = (subtheme) => {
        // Navigálás a játék oldalra
        if (selectedTheme.title === 'Foci' && subtheme.title === 'FC 26 játékos értékelés') {
            navigate('/fc26-ertekeles');
        } else if (selectedTheme.title === 'Foci' && subtheme.title === 'Játékos életkor') {
            navigate('/jatekos-eletkor');
        } else if (selectedTheme.title === 'Foci' && subtheme.title === 'Játékos piaci érték') {
            navigate('/piaci-ertek');
        } else {
            console.log('Játék indítása:', selectedTheme.title, subtheme.title);
            // További játékok itt implementálhatók
        }
    };

    return (
        <div className="temavalasztas-container">
            <h1 className="page-title">🎯 Témaválasztás</h1>
            <br />
            <p className="page-description">Válaszd ki a játék témáját az alábbi lehetőségek közül!</p>
            {!selectedTheme ? (
                <div className="theme-list">
                    {themes.map((theme) => (
                        <div key={theme.title} className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <button className="theme-btn compact" tabIndex={-1}>
                                        <theme.icon className="theme-icon" />
                                        <span className="theme-title">{theme.title}</span>
                                    </button>
                                </div>
                                <div className="flip-card-back">
                                    <button className="theme-btn compact" onClick={() => handleThemeClick(theme)} tabIndex={0}>
                                        <span className="theme-desc">{theme.desc}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="subtheme-list">
                    <button className="back-btn" onClick={() => setSelectedTheme(null)}>← Vissza</button>
                    <h2 className="subtheme-title">{selectedTheme.title} altémák</h2>
                    {selectedTheme.subthemes.map((sub) => (
                        <button key={sub.title} className="subtheme-btn compact" onClick={() => handleSubthemeClick(sub)}>
                            <span className="subtheme-title">{sub.title}</span>
                            <br />
                            <span className="subtheme-desc">{sub.desc}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Temavalasztas;