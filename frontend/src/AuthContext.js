import React, { createContext, useContext, useState, useEffect } from 'react';
import config from './config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ellenőrzi, hogy van-e érvényes token a localStorage-ban
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Token érvényességének ellenőrzése (egyszerű ellenőrzés a lejárati időre)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser({
            id: payload.id,
            nev: payload.nev,
            szerepkor: payload.szerepkor
          });
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (felh_nev, jelszo) => {
    try {
      console.log('Bejelentkezési kísérlet:', `${config.API_BASE_URL}${config.endpoints.login}`);
      
      const response = await fetch(`${config.API_BASE_URL}${config.endpoints.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ felh_nev, jelszo }),
      });

      console.log('Válasz státusz:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Hiba adatok:', errorData);
        return { 
          success: false, 
          message: errorData.message || `HTTP hiba: ${response.status}` 
        };
      }

      const data = await response.json();
      console.log('Sikeres válasz:', data);

      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      
      // Token dekódolása a felhasználói adatok kinyeréséhez
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser({
        id: payload.id,
        nev: payload.nev,
        szerepkor: payload.szerepkor
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login hiba:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          message: 'Nem sikerült csatlakozni a szerverhez. Ellenőrizd, hogy a backend fut-e.' 
        };
      }
      
      return { 
        success: false, 
        message: `Hálózati hiba: ${error.message}` 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
