import Adminfelulet from './Adminfelulet/Adminfelulet';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import OrszagModosit from './Adminfelulet/OrszagModosit';
import FociJatekModosit from './Adminfelulet/FociJatekModosit';
import Beallitasok from './Adminfelulet/Beallitasok';
import Temavalasztas from './Temavalasztas/Temavalasztas';
import Login from './Adminfelulet/Login/Login';
import Register from './Adminfelulet/Register/Register';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import './App.css';
import AdminNavbar from './Adminfelulet/AdminNavbar';
import JatekNavbar from './Jatek/JatekNavbar';

// Navbar komponens, amely feltételesen jelenik meg
const ConditionalNavbar = () => {
  const location = useLocation();
  const adminPaths = ['/adminfelulet', '/orszagmodosit', '/focijatekmodosit', '/beallitasok', '/login', '/register'];
  const isAdminPath = adminPaths.includes(location.pathname);
  
  return isAdminPath ? <AdminNavbar /> : <JatekNavbar />;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <ConditionalNavbar />
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
                path="/beallitasok" 
                element={
                  <ProtectedRoute>
                    <Beallitasok />
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
