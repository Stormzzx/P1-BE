// Endpoint para selecionar uma consulta pelo seu ID e devolver a mesma 
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 8081
const path = require('path');

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto 1'
});

// Conectar ao banco de dados
connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

app.use (express.json());


// Parte A_a - Listar todas as consultas existentes na tabela e devolver na resposta.

// Endpoint para listar todas as consultas que existem na base de dados.

app.get('/appointments', (req, res) => {
    connection.query(
        "SELECT * FROM appointments", (error, result, fields) => {
            if (error) {
                console.error('Erro ao selecionar consulta:', error);
                res.status(500).send('Erro ao selecionar consulta');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Consulta não encontrada');
                return;
            }
            res.send(result);
        });
});


// Parte A_b - Adicionar uma nova consulta à base de dados. Deverá ser enviada uma mensagem de sucesso na
//             resposta indicando o ID da consulta adicionada.

// Endpoint para adicionar uma nova consulta á base de dados inserindo os tais dados no Postman body/raw. Contém mensagem de sucesso na resposta indicando o id da consulta (appointment)

app.post('/appointments', (req, res) => {

    // Destruturação dos dados do corpo da requisição
    const { clinic, doctor_id, patient_id, room, duration, start_time, comment } = req.body;
    
    // Verifica se os campos obrigatórios estão presentes
    if (!clinic || !doctor_id || !patient_id || !room || !duration || !start_time) {
        let errorMessage = '';
        if (!clinic) {
            errorMessage += 'Clinica é obrigatório preencher. ';
        }
        if (!doctor_id) {
            errorMessage += 'Nome do Doctor é obrigatório identificar. ';
        }
        if (!patient_id) {
            errorMessage += 'Patiente é obrigatório preencher para identificar. ';
        }
        if (!room) {
            errorMessage += 'Sala é obrigatório preencher. ';
        }
        if (!duration) {
            errorMessage += 'Duração é obrigatório preencher. ';
        }
        if (!start_time) {
            errorMessage += 'Hora de início é obrigatório preencher. ';
        }
        return res.status(400).json({
            error: errorMessage
        });
    }

    // Query para inserir no banco de dados
    const sqladicionar = 'INSERT INTO appointments (clinic, doctor_id, patient_id, room, duration, start_time, comment) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sqladicionar, [clinic, doctor_id, patient_id, room, duration, start_time, comment], (error, result) => {
        if (error) {
            console.error('Erro ao adicionar a consulta.');
            return res.status(500).json({
                error: 'Erro ao adicionar consulta'
            });
        }
        const consultaId = result.insertId;
        return res.status(201).json({
            id: consultaId,
            sucesso: 'Consulta adicionada com sucesso!'
        });
    });
});


//Parte A_c - Selecionar todos as consultas de um determinado médicoe devolver essa lista na resposta.

// Endpoint para selecinar todas as consultas de um determinado médico através do id do mesmo.
app.get('/appointments/doctor_id/:doctor_id', (req, res) => {
    const doctor_id = req.params.doctor_id; // Usar req.params para obter o parâmetro da URL
    connection.query(
        "SELECT * FROM appointments WHERE doctor_id = ?", [doctor_id], (error, result, fields) => {
            if (error) {
                console.error('Erro ao selecionar consulta:', error);
                res.status(500).send('Erro ao selecionar consulta');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Consulta não encontrada');
                return;
            }
            res.send(result);
        });
});


//Parte A_d - Modificar o horário da consulta, (via query) somando ou subtraindo por exemplo 2h, e atualizar a entrada. 
//            Devolver a entrada atualizada na resposta.

// Endpoint parar modificar o horário de uma consulta atráves do seu id. A alteração é feito no body/raw do Postman-
app.put('/appointments/start_time/:id', (req, res) => {
    const id = req.params.id; // Usar req.params para obter o parâmetro da URL
    const start_time = req.body.start_time;
    connection.query(
        "UPDATE appointments SET start_time = ? WHERE id = ?", [start_time, id], (error, results) => {
            if (error) {
                console.error('Erro ao alterar o horário', error);
                return res.status(500).send('Erro ao alterar o horário');
            }
            // Verifica se algum registro foi atualizado
            if (results.affectedRows === 0) {
                return res.status(404).send('Consulta não encontrada');
            }
            res.send('Hórario da consulta, foi alterado para 2024-01-10T05:21:12.000Z !');
        });
});

// Parte A_e - Listar todas as consultas anteriores a uma hora (via query) e devolver a lista na resposta.

// Endpoint para listar todas as consultas anteriores a uma hora 

app.get('/appointments/Hanterior', (req, res) => {
    const horaA = req.query.hora; // Obtém a hora anterior da query

    // Query para selecionar as consultas anteriores à hora especificada
    const sql = 'SELECT * FROM appointments WHERE start_time < ?';

    connection.query(sql, [horaA], (error, results) => {
        if (error) {
            console.error('Erro ao buscar consultas anteriores:', error);
            return res.status(500).send('Erro ao buscar consultas anteriores.');
        }
        
        res.status(200).json(results); // Retorna a lista de consultas anteriores
    });
});

//Parte B
// Parte B_a - Selecionar apenas uma consulta pelo seu ID (via query) e devolver a mesma na resposta.
// Endpoint para selecionar uma consulta pelo seu ID e devolver a mesma 

app.get('/appointments/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        "SELECT * FROM appointments WHERE id = ?", [id], (error, result, fields) => {
            if (error) {
                console.error('Erro ao selecionar consulta:', error);
                res.status(500).send('Erro ao selecionar consulta');
                return;
            }
            if (result.length === 0) {
                res.status(404).send('Consulta não encontrada');
                return;
            }
            res.send(result[0]);
        });
});

// Parte B-b - Apagar uma consulta existente (via params) e atualizar a tabela, indicar mensagem de erro se o ID
//             da sessão a apagar não existir ou mensagem de sucesso caso seja apagada.
// Endpoint para apagar uma consulta que já exista e atualizar na tabela

app.delete('/appointments/:id', (req, res) => {
    const id = req.params.id;
    connection.query(
        "DELETE FROM appointments WHERE id = ?", [id], (error, result) => {
            if (error) {
                console.error('Erro ao apagar consulta:', error);
                res.status(500).send('Erro ao apagar consulta');
                return;
            }
            if (result.queries === 0) {
                res.status(404).send('Consulta não encontrada');
                return;
            }
            res.send('Consulta apagada com sucesso');
        });
});

//Parte B_c - Selecionar todas as consultas de uma determinada clínica e devolver essa lista na resposta.
// Endpoint para selecionar todas as consultas da clínica pretendida e devolver essa lista na resposta

app.get('/appointments/clinic/:clinic', (req, res) => {
    const clinic = req.params.clinic;
    connection.query(
        "SELECT * FROM appointments WHERE clinic = ?", [clinic], (error, result, fields) =>{
            if (error) {
                console.error('Erro ao selecionar consultas da clínica:', error);
                res.status(404).send('Erro ao selecionar consultas da clínica');
                return;
            }
        });
});

//Parte B_d - Adicionar um comentário a uma determinada consulta (mantendo os anteriores) pelo seu ID e
//            atualizar a tabela. Devolver a entrada atualizada na resposta.
// Endpoint para adicionar um comentário a uma consulta pretendida pelo seu ID e atualizar a tabela (sempre mantendo os comentarios anteriores)

app.put('/appointments/:id/comments', (req, res) => {
    const id = req.params.id;
    const comment = req.body.comment;
    connection.query(
        "UPDATE appointments SET comment = CONCAT(comment, ?) WHERE id = ?", [comment, id], (error, results) =>{
            if (error) {
                console.error('Erro ao adicionar comentário:', error);
                res.status(404).send('Erro ao adicionar comentário');
                return;
            }
            res.send('Comentário adicionado com sucesso');
        });
});


// Parte B_e - Listar todas as consultas ordenadas por ordem crescente de duração e devolver a lista ordenada
//             na resposta. A ordenação terá que ser efetuada em Javascript.
// Endpoint para listar todas as consultas ordenadas por ordem crescente de duração e devolver a lista ordenada 

app.get('/appointments/orderedqueries', async (req, res) => {
    connection.query(
        "SELECT * FROM appointments ORDER BY duration ASC", (error, results, fields) => {
            if (error) {
                console.error('Erro ao ordenar consultas:', error);
                res.status(404).send('Erro ao ordenar consultas');
                return;
            }
            res.send(results);
        });
});

// Iniciando o servidor na porta 8081
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})