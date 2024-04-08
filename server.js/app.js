const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000

app.use(express.json());

app.listen(port, () => {
    console.log('Example app listening on port ${port}')
})

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass123',
    database: 'projeto1'
});

