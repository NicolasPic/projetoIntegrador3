// Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const rota = require('./routes/routes');
const pessoa = require('../models/Pessoa')
const mongoose = require("mongoose");

// Configurações
// Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Handlebars
app.engine('handlebars', handlebars.create({defaultLayout: 'main'}).engine); 
app.set('view engine', 'handlebars');
// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost//db_Projeto").then(() => {
    console.log("Conectado ao MongoDB");
}).catch((err) => {
    console.log("Erro de conexão: " + err);
});

// Rotas
app.use('/routes', rota);

// Outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});