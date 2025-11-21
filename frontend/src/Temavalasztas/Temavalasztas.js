import React from 'react';
import './TemavalasztasStyles.css';

const Temavalasztas = () => {
    return (
        <div className="temavalasztas-container">
            <h1 className="page-title">🎯 Témaválasztás</h1>
            <p className="page-description">Válaszd ki a játék témáját az alábbi lehetőségek közül!</p>
            
            <div className="theme-buttons">
                <button className="theme-btn">
                    <span className="theme-icon">⚽</span>
                    <span className="theme-title">Foci</span>
                    <span className="theme-desc">Csapatok, bajnokságok</span>
                </button>
                
                <button className="theme-btn">
                    <span className="theme-icon">🌍</span>
                    <span className="theme-title">Országok</span>
                    <span className="theme-desc">Népesség, területek</span>
                </button>
                
                <button className="theme-btn">
                    <span className="theme-icon">🎵</span>
                    <span className="theme-title">Zene</span>
                    <span className="theme-desc">Előadók, számok</span>
                </button>
            </div>
        </div>
    );
};

export default Temavalasztas;