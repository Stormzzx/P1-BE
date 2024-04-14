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

//Parte B
// Parte B_a - Selecionar apenas uma consulta pelo seu ID (via query) e devolver a mesma na resposta.
// Endpoint para selecionar uma consulta pelo seu ID e devolver a mesma 

app.get('/appointments/:id', (req, res) => {
    // Endpoint genérico para selecionar uma consulta pelo ID
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
        "SELECT * FROM appointments WHERE clinic = ?", [clinic], (error, result) =>{
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

app.get('/appointments/ordered', (req, res) => {
    // Endpoint específico para listar consultas ordenadas
    connection.query(
        "SELECT * FROM appointments ORDER BY duration ASC", (error, results, fields) => {
            if (error) {
                console.error('Erro ao ordenar consultas:', error);
                res.status(500).send('Erro ao ordenar consultas'); //erro de servidor
                return;
            }
            res.send(results);
        });
});

// Iniciando o servidor na porta 8081
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
