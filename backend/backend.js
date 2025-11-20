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


// FMáté végpontjai


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

