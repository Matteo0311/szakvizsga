// API konfiguráció
const config = {
  // Most hogy a frontend másik porton fut (3001), vissza kell térni a teljes URL-hez
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  
  // API végpontok
  endpoints: {
    login: '/login',
    // További végpontok itt adhatók hozzá
  }
};

export default config;
