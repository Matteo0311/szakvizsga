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
        WHERE felh_nev = ? AND felh_jelszo = SHA2(?, 256) and felh_szerepkor = 'admin'
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

// Felhasználó regisztrálása (felhasználónév, e-mail-cím, felhasználó jelszó 2x, 1 e-mail cím lehet egy felhasználóhoz kötve, ugyanolyan felhasználónév nem szerepelhet többször)
app.post('/register', (req, res) => {
    const { felh_nev, email, jelszo1, jelszo2 } = req.body;

    // Ellenőrzés: Jelszavak egyeznek-e?
    if (jelszo1 !== jelszo2) {
        return res.status(400).json({ message: 'A jelszavaknak egyezniük kell.' });
    }

    // Ellenőrzés: Felhasználónév már létezik?
    pool.query('SELECT * FROM account WHERE felh_nev = ?', [felh_nev], (error, results) => {
        if (error) {
            console.error('Hiba a felhasználónév ellenőrzésekor:', error);
            return res.status(500).json({ error: 'Hiba a felhasználónév ellenőrzésekor' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Ez a felhasználónév már foglalt.' });
        }

        // Ellenőrzés: E-mail cím már létezik?
        pool.query('SELECT * FROM account WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error('Hiba az e-mail cím ellenőrzésekor:', error);
                return res.status(500).json({ error: 'Hiba az e-mail cím ellenőrzésekor' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Ez az e-mail cím már regisztrálva van.' });
            }

            // Új felhasználó regisztrálása
            pool.query(
                'INSERT INTO account (felh_nev, email, felh_jelszo, felh_szerepkor) VALUES (?, ?, SHA2(?, 256), ?)',
                [felh_nev, email, jelszo1, 'user'], // Alapértelmezett szerepkör: 'user'
                (error, results) => {
                    if (error) {
                        console.error('Hiba a felhasználó regisztrálásakor:', error);
                        res.status(500).json({ error: 'Hiba a felhasználó regisztrálásakor' });
                    } else {
                        res.json({ message: 'Felhasználó sikeresen regisztrálva', results });
                    }
                }
            );
        });
    });
});

// Regisztrált összes profil lekérdezése (minden adattal együtt) - csak adminoknak
app.get('/felhasznalokLekerdezese', authenticateToken, (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva. Csak adminok számára.' });
    }

    pool.query('SELECT felh_id, felh_nev, email, felh_szerepkor, regisztracio_datuma FROM account', (error, results) => {
        if (error) {
            console.error('Hiba a felhasználók lekérdezésekor:', error);
            return res.status(500).json({ error: 'Hiba a felhasználók lekérdezésekor' });
        }
        res.json(results);
    });
});

// kiválasztott profil módosítása - csak adminoknak
app.put('/felhasznaloModosit/:id', authenticateToken, (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva. Csak adminok számára.' });
    }
    const felh_id_from_url = req.params.id;
    const { felh_nev, jelszo, email, felh_szerepkor } = req.body;
    
    if (jelszo && jelszo.trim() !== '') {
        pool.query(
            'UPDATE account SET felh_nev = ?, felh_jelszo = SHA2(?, 256), email = ?, felh_szerepkor = ? WHERE felh_id = ?',
            [felh_nev, jelszo, email, felh_szerepkor, felh_id_from_url],
            (error, results) => {
                if (error) {
                    console.error('Hiba a felhasználó módosításakor:', error);
                    return res.status(500).json({ error: 'Hiba a felhasználó módosításakor' });
                }
                res.json({ message: 'Felhasználó adatai módosítva (jelszóval együtt)', results });
            }
        );
    } else {
        pool.query(
            'UPDATE account SET felh_nev = ?, email = ?, felh_szerepkor = ? WHERE felh_id = ?',
            [felh_nev, email, felh_szerepkor, felh_id_from_url],
            (error, results) => {
                if (error) {
                    console.error('Hiba a felhasználó módosításakor:', error);
                    return res.status(500).json({ error: 'Hiba a felhasználó módosításakor' });
                }
                res.json({ message: 'Felhasználó adatai módosítva (jelszó nélkül)', results });
            }
        );
    }
});

// regisztrált profil törlése ID alapján - csak adminoknak
app.delete('/felhasznaloTorles/:id', authenticateToken, (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva. Csak adminok számára.' });
    }
    const felh_id_from_url = req.params.id;
    pool.query(
        'DELETE FROM account WHERE felh_id = ?',
        [felh_id_from_url],
        (error, results) => {
            if (error) {
                console.error('Hiba a felhasználó törlésekor:', error);
                return res.status(500).json({ error: 'Hiba a felhasználó törlésekor' });
            }
            res.json({ message: 'Felhasználó törölve', results });
        }
    );
});

// regisztrált profil keresése felhasználónév (részleges egyezés) VAGY ID  VAGY E-mail-cím alapján - csak adminoknak
app.get('/felhasznaloKereses/:searchTerm', authenticateToken, (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva. Csak adminok számára.' });
    }
    const searchTerm = req.params.searchTerm;

    const sqlQuery = `
        SELECT * FROM account
        WHERE felh_nev LIKE CONCAT('%', ?, '%')
        OR felh_id = ?
        OR email LIKE CONCAT('%', ?, '%')
    `;
    pool.query(sqlQuery, [searchTerm, searchTerm, searchTerm], (error, results) => {
        if (error) {
            console.error('Hiba a felhasználó keresésekor:', error);
            return res.status(500).json({ error: 'Hiba a felhasználó keresésekor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Nincs találat a keresési feltételre.' });
        }
        res.json(results);
    });
});
// Regisztált profilok közötti szűrőre való keresés - csak adminoknak (Regisztrálás időpontja szerint növekvő/csökkenő, szerepkör szerint növekvő/csökkenő)
app.get('/felhasznaloSzuro/:filterBy/:order', authenticateToken, (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva. Csak adminok számára.' });
    }

    const { filterBy, order } = req.params;

    let validFilterBy;
    let validOrder;

    if (filterBy === 'regisztracio_ido') {
        validFilterBy = 'regisztracio_datuma'; 
    } else if (filterBy === 'szerepkor') {
        validFilterBy = 'felh_szerepkor'; 
    } else {
        return res.status(400).json({ message: 'Érvénytelen szűrési feltétel.' });
    }

    if (order === 'asc' || order === 'desc') {
        validOrder = order.toUpperCase();  // ASC vagy DESC
    } else {
        return res.status(400).json({ message: 'Érvénytelen rendezési irány.' });
    }

    const sqlQuery = `
        SELECT * FROM account
        ORDER BY ${validFilterBy} ${validOrder}
    `;
    pool.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Hiba a felhasználók lekérdezésekor:', error);
            return res.status(500).json({ error: 'Hiba a felhasználók lekérdezésekor' });
        }
        res.json(results);
    });
});

// ----- Máté végpontjai vége -----
// ----- Fekete Máté végpontjai -----

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

// Foci játékos törlése ID alapján
app.delete('/focijatekosTorles/:id', (req, res) => {
    const foci_jatekos_id_from_url = req.params.id;

    pool.query(
        'DELETE FROM foci_jatekos WHERE foci_jatekos_id = ?',
        [foci_jatekos_id_from_url],
        (error, results) => {
            if (error) {
                console.error('Hiba a foci játékos törlésekor:', error);
                res.status(500).json({ error: 'Hiba a foci játékos törlésekor' });
            } else {
                res.json({ message: 'Foci játékos sikeresen törölve', results });
            }
        }
    );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

