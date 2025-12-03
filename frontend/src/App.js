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
import Piaci_Ertek from './Foci/Piaci_Ertek/Piaci_Ertek';
import UserLogin from './userfelulet/Login/Login';
import UserRegister from './userfelulet/Register/Register';
import UserProfile from './userfelulet/UserProfile';
import UserNavbar from './userfelulet/UserNavbar';
import UserProtectedRoute from './userfelulet/UserProtectedRoute';
import FelhasznaloAdatModosit from './userfelulet/FelhasznaloAdatModosit/FelhasznaloAdatModosit';
import NotFound from './404_not_found/404_not_found';

// Navbar komponens, amely feltételesen jelenik meg
const ConditionalNavbar = () => null;

function AppContent() {
  const location = useLocation();
  return location.pathname === '/404' ? (
    <NotFound />
  ) : (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Temavalasztas />} />
        <Route path="/temavalasztas" element={<Temavalasztas />} />
        <Route path="/fc26-ertekeles" element={<FC26Ertekeles />} />
        <Route path="/jatekos-eletkor" element={<JatekosEletkor />} />
        <Route path="/piaci-ertek" element={<Piaci_Ertek />} />
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
        <Route 
          path="/backend-test" 
          element={
            <ProtectedRoute>
              <BackendTest />
            </ProtectedRoute>
          } 
        />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route 
          path="/user/profile" 
          element={
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          }
        />
        <Route 
          path="/user/adatmodositas" 
          element={
            <UserProtectedRoute>
              <FelhasznaloAdatModosit />
            </UserProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
