import React, { useState } from 'react';
import './TemavalasztasStyles.css';

const themes = [
    {
        title: 'Foci',
        icon: '⚽',
        desc: 'Foci játékos értékelés, életkor, piaci érték',
        subthemes: [
            { title: 'FC 26 játékos értékelés', desc: 'Melyik játékosnak nagyobb az FC 26 értékelése!' },
            { title: 'Játékos életkor', desc: 'Melyik játékos az idősebb?' },
            { title: 'Játékos piaci érték', desc: 'Melyik játékosnak nagyobb a piaci értéke?' }
        ],
    },
    {
        title: 'Országok',
        icon: '🌍',
        desc: 'Népesség, terület, GDP',
        subthemes: [
            { title: 'Európa', desc: 'Európai országok' },
            { title: 'Világ', desc: 'Összes ország' },
        ],
    },
    {
        title: 'Zene',
        icon: '🎵',
        desc: 'Előadók, számok',
        subthemes: [
            { title: 'Magyar', desc: 'Magyar előadók' },
            { title: 'Nemzetközi', desc: 'Külföldi előadók' },
        ],
    },
];

const Temavalasztas = () => {
    const [selectedTheme, setSelectedTheme] = useState(null);

    const handleThemeClick = (theme) => {
        setSelectedTheme(theme);
    };

    const handleSubthemeClick = (subtheme) => {
        // Itt lehet navigálni a játék oldalra, pl. react-router-rel
        // Most csak logoljuk
        console.log('Játék indítása:', selectedTheme.title, subtheme.title);
    };

    return (
        <div className="temavalasztas-container">
            <h1 className="page-title">🎯 Témaválasztás</h1>
            <br />
            <p className="page-description">Válaszd ki a játék témáját az alábbi lehetőségek közül!</p>
            {!selectedTheme ? (
                <div className="theme-list">
                    {themes.map((theme) => (
                        <button key={theme.title} className="theme-btn compact" onClick={() => handleThemeClick(theme)}>
                            <span className="theme-icon">{theme.icon}</span>
                            <span className="theme-title">{theme.title}</span>
                            <span className="theme-desc">{theme.desc}</span>
                        </button>
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