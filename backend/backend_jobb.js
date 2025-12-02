const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

console.log('JWT titkos kulcs:', JWT_SECRET);


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

// Országok összes adatának módosítása (auth szükséges)
app.put('/orszagAdatModosit/:id', authenticateToken, (req, res) => {
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
// Új ország hozzáadása (auth szükséges)
app.post('/ujOrszagFelvitele', authenticateToken, (req, res) => {
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

// Ország törlése ID alapján (auth szükséges)
app.delete('/orszagTorles/:id', authenticateToken, (req, res) => {
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

// 2. Bejelentkezési Végpont (TOKEN GENERÁLÁSA) - minden felhasználónak (admin és user)
app.post('/login', (req, res) => {
    const { felh_nev, jelszo } = req.body;
    pool.query(
        'SELECT felh_id, felh_nev, felh_szerepkor, felh_jelszo FROM account WHERE felh_nev = ?',
        [felh_nev],
        (error, results) => {
            if (error) {
                console.error('Adatbázis hiba a bejelentkezéskor:', error);
                return res.status(500).json({ error: 'Adatbázis hiba.' });
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó' });
            }
            const user = results[0];
            // bcrypt összehasonlítás
            bcrypt.compare(jelszo, user.felh_jelszo, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó' });
                }
                // Sikeres bejelentkezés: JWT token generálása
                const token = jwt.sign(
                    {
                        id: user.felh_id,
                        nev: user.felh_nev,
                        szerepkor: user.felh_szerepkor
                    },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.json({
                    message: 'Sikeres bejelentkezés',
                    token: token,
                    szerepkor: user.felh_szerepkor
                });
            });
        }
    );
});

// Felhasználó regisztrálása (bcrypt hash!)
app.post('/register', async (req, res) => {
    const { felh_nev, email, jelszo1, jelszo2 } = req.body;
    // Jelszó minimum szabály
    if (!jelszo1 || jelszo1.length < 6 || /^\s+$/.test(jelszo1)) {
        return res.status(400).json({ message: 'A jelszónak legalább 6 karakterből kell állnia.' });
    }
    if (jelszo1 !== jelszo2) {
        return res.status(400).json({ message: 'A jelszavaknak egyezniük kell.' });
    }
    try {
        const [userByName] = await new Promise((resolve, reject) => {
            pool.query('SELECT * FROM account WHERE felh_nev = ?', [felh_nev], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
        if (userByName) {
            return res.status(400).json({ message: 'Ez a felhasználónév már foglalt.' });
        }
        const [userByEmail] = await new Promise((resolve, reject) => {
            pool.query('SELECT * FROM account WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
        if (userByEmail) {
            return res.status(400).json({ message: 'Ez az e-mail cím már regisztrálva van.' });
        }
        const hash = await bcrypt.hash(jelszo1, 10);
        await new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO account (felh_nev, email, felh_jelszo, felh_szerepkor) VALUES (?, ?, ?, ?)',
                [felh_nev, email, hash, 'user'],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });
        res.json({ message: 'Sikeres regisztráció!' });
    } catch (error) {
        console.error('Regisztrációs hiba:', error);
        return res.status(500).json({ error: 'Hiba a regisztrációnál' });
    }
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
app.put('/felhasznaloModosit/:id', authenticateToken, async (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva. Csak adminok számára.' });
    }
    const felh_id_from_url = req.params.id;
    const { felh_nev, jelszo, email, felh_szerepkor } = req.body;

    try {
        // Lekérjük az aktuális adatokat
        const [currentUser] = await new Promise((resolve, reject) => {
            pool.query('SELECT felh_nev, email, felh_szerepkor, felh_jelszo FROM account WHERE felh_id = ?', [felh_id_from_url], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
        if (!currentUser) {
            return res.status(404).json({ message: 'Felhasználó nem található.' });
        }
        // Ha bármelyik mezőnél az új érték megegyezik a régivel, ne engedje a módosítást
        if (currentUser.felh_nev === felh_nev) {
            return res.status(400).json({ message: 'A felhasználónév nem változott, módosítás nem engedélyezett.' });
        }
        if (currentUser.email === email) {
            return res.status(400).json({ message: 'Az e-mail cím nem változott, módosítás nem engedélyezett.' });
        }
        if (currentUser.felh_szerepkor === felh_szerepkor) {
            return res.status(400).json({ message: 'A szerepkör nem változott, módosítás nem engedélyezett.' });
        }
        if (jelszo && jelszo.trim() !== '') {
            // Jelszó hash összehasonlítás
            const bcryptMatch = await bcrypt.compare(jelszo, currentUser.felh_jelszo);
            if (bcryptMatch) {
                return res.status(400).json({ message: 'A jelszó nem változott, módosítás nem engedélyezett.' });
            }
        }

        // Ellenőrzés: van-e másik felhasználó ugyanazzal a névvel vagy e-maillel (kivéve saját magát)
        const [userByName] = await new Promise((resolve, reject) => {
            pool.query('SELECT * FROM account WHERE felh_nev = ? AND felh_id != ?', [felh_nev, felh_id_from_url], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
        if (userByName) {
            return res.status(400).json({ message: 'Ez a felhasználónév már foglalt.' });
        }
        const [userByEmail] = await new Promise((resolve, reject) => {
            pool.query('SELECT * FROM account WHERE email = ? AND felh_id != ?', [email, felh_id_from_url], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
        if (userByEmail) {
            return res.status(400).json({ message: 'Ez az e-mail cím már regisztrálva van.' });
        }

        if (jelszo && jelszo.trim() !== '') {
            // Jelszó hash-elése bcrypt-tel
            bcrypt.hash(jelszo, 10, (err, hash) => {
                if (err) {
                    console.error('Hiba a jelszó hash-elésekor:', err);
                    return res.status(500).json({ error: 'Hiba a jelszó hash-elésekor' });
                }
                pool.query(
                    'UPDATE account SET felh_nev = ?, felh_jelszo = ?, email = ?, felh_szerepkor = ? WHERE felh_id = ?',
                    [felh_nev, hash, email, felh_szerepkor, felh_id_from_url],
                    (error, results) => {
                        if (error) {
                            console.error('Hiba a felhasználó módosításakor:', error);
                            return res.status(500).json({ error: 'Hiba a felhasználó módosításakor' });
                        }
                        res.json({ message: 'Felhasználó adatai módosítva (jelszóval együtt)', results });
                    }
                );
            });
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
    } catch (error) {
        console.error('Felhasználó módosítási hiba:', error);
        return res.status(500).json({ error: 'Hiba a felhasználó módosításánál' });
    }
});

// regisztrált profil törlése ID alapján - csak adminoknak (ADMIN PROFILOK NEM TÖRÖLHETŐEK)
app.delete('/felhasznaloTorles/:id', authenticateToken, (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Hozzáférés megtagadva. Csak adminok számára.' });
    }
    const felh_id_from_url = req.params.id;
    pool.query(
        'DELETE FROM account WHERE felh_id = ? AND felh_szerepkor <> "admin"',
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
        SELECT felh_id, felh_nev, email, felh_szerepkor, regisztracio_datuma FROM account
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
        SELECT felh_id, felh_nev, email, felh_szerepkor, regisztracio_datuma FROM account
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

// regisztrált profil saját adatainak lekérdezése (token alapján)
app.get('/sajatFelhAdatok', authenticateToken, (req, res) => {
    const felh_id = req.user.id;
    pool.query(
        'SELECT felh_id, felh_nev, email, felh_szerepkor, regisztracio_datuma FROM account WHERE felh_id = ?',
        [felh_id],
        (error, results) => {
            if (error) {
                console.error('Hiba a saját adatok lekérdezésekor:', error);
                return res.status(500).json({ error: 'Hiba a saját adatok lekérdezésekor' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Nincs találat a saját adatokra.' });
            }
            res.json(results[0]);
        }
    );
});

// regisztrált profil saját adatainak módosítása (token alapján)
app.put('/sajatFelhModosit', authenticateToken, async (req, res) => {
    const felh_id = req.user.id;
    const { felh_nev, email } = req.body;
    if (!felh_nev && !email) {
        return res.status(400).json({ message: 'Nincs módosítandó adat.' });
    }
    try {
        if (felh_nev) {
            const [nevCheck] = await new Promise((resolve, reject) => {
                pool.query('SELECT felh_id FROM account WHERE felh_nev = ? AND felh_id != ?', [felh_nev, felh_id], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });
            if (nevCheck) {
                return res.status(400).json({ message: 'Ez a felhasználónév már foglalt.' });
            }
        }
        if (email) {
            const [emailCheck] = await new Promise((resolve, reject) => {
                pool.query('SELECT felh_id FROM account WHERE email = ? AND felh_id != ?', [email, felh_id], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });
            if (emailCheck) {
                return res.status(400).json({ message: 'Ez az e-mail cím már regisztrálva van.' });
            }
        }
        let updateFields = [];
        let updateValues = [];
        if (felh_nev) {
            updateFields.push('felh_nev = ?');
            updateValues.push(felh_nev);
        }
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        updateValues.push(felh_id);
        await new Promise((resolve, reject) => {
            pool.query(`UPDATE account SET ${updateFields.join(', ')} WHERE felh_id = ?`, updateValues, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
        res.json({ message: 'Profil sikeresen módosítva' });
    } catch (error) {
        console.error('Hiba a módosításkor:', error);
        return res.status(500).json({ error: 'Hiba a módosításkor' });
    }
});

// saját profil jelszómódosítása (token alapján)
app.put('/sajatJelszoModosit', authenticateToken, (req, res) => {
    const felh_id = req.user.id;
    const { regi_jelszo, uj_jelszo, uj_jelszo_ismet } = req.body;
    
    // Validáció
    if (!regi_jelszo || !uj_jelszo || !uj_jelszo_ismet) {
        return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
    }
    
    if (uj_jelszo !== uj_jelszo_ismet) {
        return res.status(400).json({ message: 'Az új jelszavak nem egyeznek!' });
    }
    
    if (uj_jelszo.length < 6) {
        return res.status(400).json({ message: 'A jelszó legalább 6 karakter legyen!' });
    }
    
    // Régi jelszó ellenőrzése
    pool.query(
        'SELECT felh_jelszo FROM account WHERE felh_id = ?',
        [felh_id],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Adatbázis hiba' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ message: 'Felhasználó nem található' });
            }
            
            const user = results[0];
            
            // Régi jelszó összehasonlítása
            bcrypt.compare(regi_jelszo, user.felh_jelszo, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({ message: 'A régi jelszó helytelen!' });
                }
                
                // Új jelszó hash-elése
                bcrypt.hash(uj_jelszo, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: 'Hiba a jelszó hash-elésekor' });
                    }
                    
                    // Jelszó frissítése
                    pool.query(
                        'UPDATE account SET felh_jelszo = ? WHERE felh_id = ?',
                        [hash, felh_id],
                        (error, results) => {
                            if (error) {
                                return res.status(500).json({ error: 'Hiba a jelszó módosításakor' });
                            }
                            res.json({ message: 'Jelszó sikeresen megváltoztatva!' });
                        }
                    );
                });
            });
        }
    );
});

// regisztrált profil saját profiljának törlése (token alapján) - adatbázisból az összes adatával való törlése
app.delete('/sajatFelhTorles', authenticateToken, (req, res) => {
    const felh_id = req.user.id;

    pool.query(
        'DELETE FROM account WHERE felh_id = ?',
        [felh_id],
        (error, results) => {
            if (error) {
                console.error('Hiba a felhasználó törlésekor:', error);
                return res.status(500).json({ error: 'Hiba a felhasználó törlésekor' });
            }
            res.json({ message: 'Sikeresen törölve', results });
        }
    );
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
// Foci játékos összes adatának módosítása (auth szükséges)
app.put('/focijatekosAdatModosit/:id', authenticateToken, (req, res) => {
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
// Új foci játékos hozzáadása (auth szükséges)
app.post('/ujFocijatekosFelvitele', authenticateToken, (req, res) => {
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

// Foci játékos törlése ID alapján (auth szükséges)
app.delete('/focijatekosTorles/:id', authenticateToken, (req, res) => {
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

// Példa védett admin végpontra:
app.get('/admin/dashboard', authenticateToken, (req, res) => {
    if (req.user.szerepkor !== 'admin') {
        return res.status(403).json({ message: 'Csak adminok számára.' });
    }
    res.json({ message: 'Admin dashboard elérve.' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

// Globális hibakezelés, hogy minden hiba látszódjon és ne álljon le a szerver
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

