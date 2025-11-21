const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'A_TE_SZAKDOLGOZAT_TITKOS_KULCSOD';

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
// Főtéma adat betöltése
app.get('/temaAdatBetolt', (req, res) => {
    pool.query('SELECT * FROM fotema', (error, results) => {
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

// Ország törlése ID alapján
app.delete('/orszagTorles/:id', (req, res) => {
    const orszag_id_from_url = req.params.id;
    pool.query(
        'DELETE FROM orszag WHERE orszag_id = ?',
        [orszag_id_from_url],
        (error, results) => {
            if (error) {
                console.error('Hiba az ország törlésekor:', error);
                res.status(500).json({ error: 'Hiba az ország törlésekor' });
            } else {
                res.json({ message: 'Ország törölve', results });
            }
        }
    );
});

// -----------------------------------------------------------------------------------
// FIÓKKEZELÉS
// BEJELENTKEZÉS
// -----------------------------------------------------------------------------------

// 1. JWT Ellenőrző Middleware (EZ VÉDI A VÉGPONTOKAT)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Elvárás: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        // 401: Unauthorized (Token hiányzik)
        return res.status(401).json({ message: 'Hozzáférés megtagadva. Token hiányzik.' }); 
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403: Forbidden (Érvénytelen, lejárt token)
            return res.status(403).json({ message: 'Token érvénytelen vagy lejárt.' }); 
        }
        req.user = user; 
        next(); 
    });
}

// 2. Bejelentkezési Végpont (TOKEN GENERÁLÁSA)
app.post('/login', (req, res) => {
    const { felh_nev, jelszo } = req.body; 

    // SHA256-alapú hitelesítés az adatbázisban
    const sqlQuery = `
        SELECT felh_id, felh_nev, felh_szerepkor 
        FROM account 
        WHERE felh_nev = ? AND felh_jelszo = SHA2(?, 256)
    `;

    pool.query(
        sqlQuery,
        [felh_nev, jelszo], 
        (error, results) => {
            if (error) {
                console.error('Adatbázis hiba a bejelentkezéskor:', error);
                return res.status(500).json({ error: 'Adatbázis hiba.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó' });
            }

            const user = results[0];
            
            // Sikeres bejelentkezés: JWT token generálása
            const token = jwt.sign(
                { 
                    id: user.felh_id, 
                    nev: user.felh_nev,
                    szerepkor: user.felh_szerepkor 
                }, 
                JWT_SECRET,
                { expiresIn: '1h' } // Token 1 óra múlva lejár
            );

            res.json({ 
                message: 'Sikeres bejelentkezés', 
                token: token,
                szerepkor: user.felh_szerepkor
            });
        }
    );
});

// FMáté végpontjai


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

