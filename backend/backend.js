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

// Országok keresése név (részleges egyezés) VAGY ID alapján

app.get('/orszagKereses/:searchTerm', (req, res) => {
    const searchTerm = req.params.searchTerm; 
    
    const sqlQuery = `
        SELECT * FROM orszag 
        WHERE orszag_nev LIKE CONCAT('%', ?, '%') 
        OR orszag_id = ?
    `;

    pool.query(sqlQuery, [searchTerm, searchTerm], (error, results) => {
        if (error) {
            console.error('Hiba az ország keresésekor:', error);
            res.status(500).json({ error: 'Hiba az ország keresésekor' });
        } else {

             if (results.length === 0) {
                 return res.status(404).json({ message: 'Nincs találat a keresési feltételre.' });
             }
            res.json(results);
        }
    });
});
// FMáté végpontjai

// Foci játékos adat betöltése
app.get('/focijatekosAdatBetolt', (req, res) => {
    pool.query('SELECT * FROM foci_jatekos', (error, results) => {
        if (error) {
            console.error('Hiba az adatok betöltésekor:', error);
            res.status(500).json({ error: 'Hiba az adatok betöltésekor' });
        } else {
            res.json(results);
        }
    });
});
// Foci játékos összes adatának módosítása
app.put('/focijatekosAdatModosit/:id', (req, res) => {
    const foci_jatekos_id_from_url = req.params.id;
    const { foci_jatekos_nev,foci_jatekos_ertekeles,foci_jatekos_piaci_ertek,foci_jatekos_eletkor } = req.body;

    pool.query(
        'UPDATE foci_jatekos SET foci_jatekos_nev=?,foci_jatekos_ertekeles=?,foci_jatekos_piaci_ertek=?,foci_jatekos_eletkor=? WHERE foci_jatekos_id = ?',
        [foci_jatekos_nev,foci_jatekos_ertekeles,foci_jatekos_piaci_ertek,foci_jatekos_eletkor, foci_jatekos_id_from_url],

        (error, results) => {
            if (error) {
                console.error('Hiba az adatok módosításakor:', error);
                res.status(500).json({ error: 'Hiba az adatok módosításakor' });
            } else {
                res.json({ message: 'Foci jatekos adatai módosítva', results });
            }
        }
    );
});
// Új foci játékos hozzáadása (Jatekos neve, értékelése, piaci értéke, életkora)
app.post('/ujFocijatekosFelvitele', (req, res) => {
    const { foci_jatekos_nev,foci_jatekos_ertekeles,foci_jatekos_piaci_ertek,foci_jatekos_eletkor } = req.body;

    pool.query(
        'INSERT INTO foci_jatekos (foci_jatekos_nev,foci_jatekos_ertekeles,foci_jatekos_piaci_ertek,foci_jatekos_eletkor) VALUES (?, ?, ?, ?)',
        [foci_jatekos_nev,foci_jatekos_ertekeles,foci_jatekos_piaci_ertek,foci_jatekos_eletkor],
        (error, results) => {
            if (error) {
                console.error('Hiba az új ország hozzáadásakor:', error);
                res.status(500).json({ error: 'Hiba az új foci játékos hozzáadásakor' });
            } else {
                res.json({ message: 'Új foci játékos hozzáadva', results });
            }
        }
    );
});

// Foci játékos keresése név (részleges egyezés) VAGY ID alapján

app.get('/focijatekosKereses/:searchTerm', (req, res) => {
    const searchTerm = req.params.searchTerm; 
    
    const sqlQuery = `
        SELECT * FROM foci_jatekos 
        WHERE foci_jatekos_nev LIKE CONCAT('%', ?, '%') 
        OR foci_jatekos_id = ?
    `;

    pool.query(sqlQuery, [searchTerm, searchTerm], (error, results) => {
        if (error) {
            console.error('Hiba a foci játékos keresésekor:', error);
            res.status(500).json({ error: 'Hiba a foci játékos keresésekor' });
        } else {

             if (results.length === 0) {
                 return res.status(404).json({ message: 'Nincs találat a keresési feltételre.' });
             }
            res.json(results);
        }
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

