const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const cors = require('cors')
app.use(cors())

app.use(express.json())

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'higherorlower'
    })
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// ----- Máté végpontjai -----
// Ország adat betöltése
app.get('/orszagAdatBetolt', (req, res) => {
    pool.query('SELECT * FROM orszag', (error, results) => {
        if (error) {
            console.error('Hiba az adatok betöltésekor:', error);
            res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
        } else {
            res.json(results);
        }
    });
});
// Országok összes adatának módosítása
app.put('/orszagAdatModosit/:id', (req, res) => {
    const orszag_id_from_url = req.params.id;
    const { orszag_nev, orszag_nepesseg, orszag_nagysag, orszag_gdp } = req.body;

    pool.query(
        'UPDATE orszag SET orszag_nev = ?, orszag_nepesseg = ?, orszag_nagysag = ?, orszag_gdp = ? WHERE orszag_id = ?',
        [orszag_nev, orszag_nepesseg, orszag_nagysag, orszag_gdp, orszag_id_from_url],

        (error, results) => {
            if (error) {
                console.error('Hiba az adatok módosításakor:', error);
                res.status(500).json({ error: 'Hiba az adatok módosításakor' });
            } else {
                res.json({ message: 'Ország adatai módosítva', results });
            }
        }
    );
});
// Új ország hozzáadása (Országnév, népesség, nagyság, gdp)
app.post('/ujOrszagFelvitele', (req, res) => {
    const { orszag_nev, orszag_nepesseg, orszag_nagysag, orszag_gdp } = req.body;

    pool.query(
        'INSERT INTO orszag (orszag_nev, orszag_nepesseg, orszag_nagysag, orszag_gdp) VALUES (?, ?, ?, ?)',
        [orszag_nev, orszag_nepesseg, orszag_nagysag, orszag_gdp],
        (error, results) => {
            if (error) {
                console.error('Hiba az új ország hozzáadásakor:', error);
                res.status(500).json({ error: 'Hiba az új ország hozzáadásakor' });
            } else {
                res.json({ message: 'Új ország hozzáadva', results });
            }
        }
    );
});

// FMáté végpontjai


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

