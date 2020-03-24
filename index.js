const express = require('express')
const app = express()
const mysql = require('mysql')

// Uppkoppling
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'injectionManager',
    password: 'br0mmabl0cks',
    database: 'injection',
})

// Starta kontakt med servern.
connection.connect()

// BAD
app.get('/users/:id', (req, res) => {
    let query = `SELECT * FROM users WHERE users.id = '${req.params.id}'`
    console.log(query)
    connection.query(query, (err, result, fields) => {
        if (err) throw err
        res.json(result)
    })
})

// GOOD
app.get('/members/:id', (req, res) => {

    let query = "SELECT * FROM members WHERE id = " + connection.escape(req.params.id)
    console.log(query)
    connection.query(query, (err, result, fields) => {
        if (err) throw err
        res.json(result)
    })
})

app.listen(8080, () => {
    console.log("The perils of sql injection is alive...")
})