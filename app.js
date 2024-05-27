// Carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const rota = require('./routes/routes');
const pessoa = require('./models/Pessoa')
const mongoose = require("mongoose");
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
require("./config/auth")(passport)

// Configurações
    //Sessão
        app.use(session({
            secret: "projeto",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())

        app.use((req,res,next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            next()
        })
        
// Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Handlebars
app.engine('handlebars', handlebars.engine ({
    defaultLayout: 'main', runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set('view engine', 'handlebars');
// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/db_Projeto").then(() => {
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