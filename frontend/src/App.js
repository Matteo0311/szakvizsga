import Adminfelulet from './Adminfelulet/Adminfelulet';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrszagModosit from './Adminfelulet/OrszagModosit';
import FociJatekModosit from './Adminfelulet/FociJatekModosit';
import Temavalasztas from './Temavalasztas/Temavalasztas';
import Login from './Login/Login';
import Register from './Register/Register';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import Navbar from './Navbar';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<div className="home-content"><h1>Üdvözöl a HigherLower alkalmazásban!</h1><p>Válaszd ki az egyik menüpontot a fent lévő navigációs sávból!</p></div>} />
              <Route path="/temavalasztas" element={<Temavalasztas />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/adminfelulet" 
                element={
                  <ProtectedRoute>
                    <Adminfelulet />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orszagmodosit" 
                element={
                  <ProtectedRoute>
                    <OrszagModosit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/focijatekmodosit" 
                element={
                  <ProtectedRoute>
                    <FociJatekModosit />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
