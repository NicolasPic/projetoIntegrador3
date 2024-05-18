const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
require('../models/Pessoa');
const Pessoa = mongoose.model("pessoa")

router.get('/', (req, res) => {
    res.send("Pagina principal");
});
//efetuou o login 
router.get('/logado', (req, res) => {
    res.send("home principal");
});
//form de nova conta 
router.get('/novaconta/form', (req, res) => {
    res.render("layouts/addpessoa");
});
//aba de ajustar os dados do perfil
router.get('/logado/ajuste/:id', (req, res) => {
    const id = req.params.id;

    // Verifica se o ID fornecido é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ message: "ID inválido." });
    }

    // Busca a pessoa correspondente no banco de dados pelo ID
    Pessoa.findById(id)
        .then(pessoa => {
            if (!pessoa) {
                return res.status(404).send({ message: "Pessoa não encontrada." });
            }

            // Renderiza o formulário de ajuste com os dados da pessoa
            res.render('layouts/attpessoa', { pessoa: pessoa });
        })
        .catch(error => {
            console.error("Erro ao buscar pessoa:", error);
            res.status(500).send({ message: "Erro ao buscar pessoa." });
        });
});

//resposta do formulario de criar nova conta
router.post('/novaconta/criada', (req, res) => {
    
    const novaPessoa = new Pessoa({
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf,
        forca: 0,
        velocidade: 0,
        agilidade: 0
    });

    new Pessoa(novaPessoa).save().then(() => {
        console.log("Sucesso");
        res.send("Sucesso ao salvar pessoa.");
        res.redirect('/');
    }).catch((err) => {
        console.log("erro");
        console.error("Erro:", err);
        res.status(500).send("Erro ao salvar pessoa.");
    });
});
//salva os dados no banco
router.post('/logado/salvar', (req, res) => {
    const id = req.body.id; // Recupera o ID do corpo da requisição

    // Verifica se o ID fornecido é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID inválido." });
    }

    // Encontra a pessoa pelo ID e atualiza os campos
    Pessoa.findById(id)
        .then(pessoa => {
            if (!pessoa) {
                return res.status(404).send({ message: "Pessoa não encontrada." });
            }

            // Atualiza os campos da pessoa
            pessoa.forca = req.body.forca;
            pessoa.velocidade = req.body.velocidade;
            pessoa.agilidade = (req.body.forca * 0.5) + (req.body.velocidade * 0.5);

            // Salva as alterações no banco de dados
            return pessoa.save();
        })
        .then(() => {
            res.send("Pessoa atualizada com sucesso.");
        })
        .catch(error => {
            console.error("Erro ao atualizar pessoa:", error);
            res.status(500).send("Erro ao atualizar pessoa.");
        });
});


//ver o perfil do jogador que quer jogar com
router.get('/logado/busca/:id', (req, res) => {
    const id = req.params.id;

    // Verifica se o ID fornecido é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        // Se não for um ObjectId válido, retorna um erro 404
        return res.status(404).send({ message: "ID inválido." });
    }

    // Busca a pessoa correspondente no banco de dados pelo ID
    Pessoa.findById(id)
        .then(pessoa => {
            // Verifica se a pessoa foi encontrada
            if (!pessoa) {
                // Se a pessoa não for encontrada, retorna um erro 404
                return res.status(404).send({ message: "Pessoa não encontrada." });
            }
            // Se a pessoa for encontrada, envia a resposta com os dados da pessoa
            res.send({ message: "Pessoa encontrada.", pessoa: pessoa });
        })
        .catch(error => {
            // Se ocorrer um erro durante a consulta, envia uma resposta de erro 500
            console.error("Erro ao buscar pessoa:", error);
            res.status(500).send({ message: "Erro ao buscar pessoa." });
        });
});


router.get('/teste');

module.exports = router;
