import Adminfelulet from './Adminfelulet/Adminfelulet';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrszagModosit from './Adminfelulet/OrszagModosit';
import FociJatekModosit from './Adminfelulet/FociJatekModosit';
import Temavalasztas from './Temavalasztas/Temavalasztas';
import './App.css';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<div className="home-content"><h1>Üdvözöl a HigherLower alkalmazásban!</h1><p>Válaszd ki az egyik menüpontot a fent lévő navigációs sávból!</p></div>} />
            <Route path="/temavalasztas" element={<Temavalasztas />} />
            <Route path="/adminfelulet" element={<Adminfelulet />} />
            <Route path="/orszagmodosit" element={<OrszagModosit />} />
            <Route path="/focijatekmodosit" element={<FociJatekModosit />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
