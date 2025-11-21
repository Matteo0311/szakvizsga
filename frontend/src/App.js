import logo from './logo.svg';
import Adminfelulet from './Adminfelulet/Adminfelulet';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrszagModosit from './Adminfelulet/OrszagModosit';
import './App.css';

function App() {
  return (
    <div className="App">
      
      <OrszagModosit />
    </div>
  );
}

export default App;
