const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
require('../models/Pessoa');
const Pessoa = mongoose.model("pessoas")

router.get('/', (req, res) => {
    res.send("Pagina principal");
});
//efetuou o login 
router.get('/logado', (req, res) => {
    res.send("Pagina principal");
});
//aba de cadastro
router.get('/cadastro', (req, res) => {
    res.send("Pagina principal");
});
//aba de ajustar os dados do perfil
router.get('/logado/ajuste', (req, res) => {
    res.send("Pagina principal");
});
//salva os dados no banco
router.post('/logado/salvar', (req, res) => {
    res.send("Pagina principal");
});
//botão de buscar jogadores com o mesmo rank
router.get('/logado/busca', (req, res) => {
    res.send("Pagina principal");
});
//ver o perfil do jogador que quer jogar com
router.get('/logado/busca/{id}', (req, res) => {
    res.send("Pagina principal");
});

router.post('/teste', (req, res) => {
    const novaP = {
        nome: nicolas,
        email: nicolasamil.com,
        cpf: 12345
    }

    new Pessoa(novaP).save().then(() => {
        console.log("Sucesso")
    }).catch((err) => {
        console.log("erro")
    })
});

router.get('/teste');

module.exports = router;
