const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000
const path = require('path');

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'portosanto2003',
    database: 'projeto1'
});

// Conectar ao banco de dados
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Definindo um endpoint para consultar na Data Base
app.get('/appointments', async (req, res) => { 
    connection.query(
        "Select * from appointments", (err, result, fields) => {
            res.send(result);
        })
});

app.delete('/appointments/:id', async (req, res) => {
    const id = req.params.id;
    connection.query(
        "Delete from appointments Where id =?;", [id], (err, result, fields) => {
            res.send(result);
        });

});


// Iniciando o servidor na porta 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

