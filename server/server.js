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
app.get('/appointments/doctor/:id', async (req, res) => {
    const id = req.params.id;
    connection.query(
        "Select * from appointments Where doctor_id =?;", [id], (err, result, fields) => {
            res.send(result);
        })

});

app.delete('/appointments/doctor/:id', async (req, res) => {
    const id = req.params.id;
    connection.query(
        "Delete from appointments Where doctor_id =?;", [id], (err, result, fields) => {
            res.send(result);
        })

});

app.post('/appointments', async (req, res) => {
    var newAppointment = req.body;
    console.log(newAppointment)
    connection.execute(
        "insert into appointments(clinic, doctor_id, patient_id, room, duration, location, start_time )  values (?, ?, ?, ?, ?, ?, ?)",

        [newAppointment.clinic, newAppointment.doctor_id, newAppointment.patient_id, newAppointment.room, newAppointment.duration, newAppointment.location, newAppointment.start_time], (err, result, fields) => {
            console.log(err, result, fields)
            res.send(result);
        })

});

// Iniciando o servidor na porta 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

