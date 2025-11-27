import Adminfelulet from './Adminfelulet/Adminfelulet';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import OrszagModosit from './Adminfelulet/OrszagModosit';
import FociJatekModosit from './Adminfelulet/FociJatekModosit';
import Beallitasok from './Adminfelulet/Beallitasok';
import Temavalasztas from './Temavalasztas/Temavalasztas';
import Login from './Adminfelulet/Login/Login';
import Register from './Adminfelulet/Register/Register';
import BackendTest from './BackendTest';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import './App.css';
import AdminNavbar from './Adminfelulet/AdminNavbar';
import JatekNavbar from './Jatek/JatekNavbar';
import FC26Ertekeles from './Foci/FC26Ertekeles/FC26Ertekeles';
import JatekosEletkor from './Foci/JatekosEletkor/JatekosEletkor';

// Navbar komponens, amely feltételesen jelenik meg
const ConditionalNavbar = () => {
  const location = useLocation();
  const adminPaths = ['/adminfelulet', '/orszagmodosit', '/focijatekmodosit', '/beallitasok', '/login', '/register', '/backend-test'];
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
              <Route path="/" element={<Temavalasztas />} />
              <Route path="/temavalasztas" element={<Temavalasztas />} />
              <Route path="/fc26-ertekeles" element={<FC26Ertekeles />} />
              <Route path="/jatekos-eletkor" element={<JatekosEletkor />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/adminfelulet" 
                element={
                  <AdminRoute>
                    <Adminfelulet />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/beallitasok" 
                element={
                  <AdminRoute>
                    <Beallitasok />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/orszagmodosit" 
                element={
                  <AdminRoute>
                    <OrszagModosit />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/focijatekmodosit" 
                element={
                  <AdminRoute>
                    <FociJatekModosit />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/backend-test" 
                element={
                  <AdminRoute>
                    <BackendTest />
                  </AdminRoute>
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
