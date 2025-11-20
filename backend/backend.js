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

// LMáté végpontjai


// FMáté végpontjai


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

