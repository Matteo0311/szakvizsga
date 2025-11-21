// Egyszerű CORS teszt
// Nyisd meg a browser console-t és futtasd ezt a kódot

fetch('http://localhost:3000/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    felh_nev: 'test',
    jelszo: 'test'
  })
})
.then(response => {
  console.log('Státusz:', response.status);
  return response.json();
})
.then(data => {
  console.log('Válasz:', data);
})
.catch(error => {
  console.error('Hiba:', error);
});
