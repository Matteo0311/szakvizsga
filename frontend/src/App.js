import logo from './logo.svg';
import Adminfelulet from './Adminfelulet/Adminfelulet';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrszagModosit from './Adminfelulet/OrszagModosit';
import './App.css';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<div className="home-content"><h1>Üdvözöl a HigherLower alkalmazásban!</h1></div>} />
            <Route path="/OrszagModosit" element={<OrszagModosit />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
