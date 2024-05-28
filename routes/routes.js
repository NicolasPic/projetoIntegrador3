const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
require('../models/Pessoa');
const Pessoa = mongoose.model("pessoa")
const passport = require("passport")

router.get('/', (req, res) => {
    res.send("Pagina principal");
});
//login
router.get('/login', (req, res) => {
    res.render("layouts/login");
});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
            successRedirect: "/routes/home",
            failureRedirect: "/routes/login",
            failureFlash: true
    })(req, res, next)
});

//efetuou o login 
router.get('/home', (req, res) => {
    res.send("home principal");
});

// Rota para testar se o login está funcionando
router.get('/testlogin', (req, res) => {
    if (req.isAuthenticated()) {
        res.send("Login bem-sucedido! Usuário logado.");
    } else {
        res.send("Você não está logado.");
    }
});

router.get('/profile', (req, res) => {
    res.send(`Nome do usuário logado: ${req.user.nome}`);
});

//form de nova conta 
router.get('/novaconta/form', (req, res) => {
    res.render("layouts/addpessoa");
});
//aba de ajustar os dados do perfil
router.get('/logado/ajuste', (req, res) => {
    const id = req.user.id;

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

// Resposta do formulário de criar nova conta
router.post('/novaconta/criada', (req, res) => {
    Pessoa.findOne({cpf: req.body.cpf}).then((pessoa) => {
        if (pessoa) {
           req.flash("error_msg", "Já existe uma conta com esse CPF");
           res.redirect("/routes/novaconta/form");
        } else {
            const novaPessoa = new Pessoa({
                nome: req.body.nome,
                email: req.body.email,
                cpf: req.body.cpf,
                forca: 0,
                velocidade: 0,
                agilidade: 0,
                camp: 0,
                rank: 0
            });
        
            novaPessoa.save().then(() => {
                req.flash("success_msg", "Conta criada com sucesso");
                res.redirect("/routes/home");
            }).catch((err) => {
                req.flash("error_msg", "Erro ao criar conta, tente novamente mais tarde.");
                res.redirect("/novaconta/form");
            });
        }
    }).catch((err) => {
        console.error("Erro interno:", err);
        req.flash("error_msg", "Erro interno");
        res.redirect("/");
    });
});


//salva os dados no banco
router.post('/logado/salvar', (req, res) => {
    const id = req.user.id; // Recupera o ID do corpo da requisição

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

            // Converte os valores para inteiros
            const forca = parseInt(req.body.forca, 10);
            const velocidade = parseInt(req.body.velocidade, 10);
            const camp = parseInt(req.body.camp, 10);

            // Calcula agilidade e rank
            const agi = Math.round((forca * 0.5) + (velocidade * 0.5));
            pessoa.forca = forca;
            pessoa.velocidade = velocidade;
            pessoa.agilidade = agi;
            pessoa.camp = camp;
            pessoa.rank = forca + velocidade + agi + camp;

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

router.get('/lista', (req, res) => {
    const userId = req.user.id;

    // Verifica se o ID do usuário logado é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        req.flash('error_msg', 'ID inválido.');
        return res.redirect('/');
    }

    // Encontra a pessoa logada para obter o rank
    Pessoa.findById(userId)
        .then(user => {
            if (!user) {
                req.flash('error_msg', 'Usuário não encontrado.');
                return res.redirect('/');
            }

            const rankReferencia = user.rank;
            const limiteInferior = rankReferencia * 0.9;
            const limiteSuperior = rankReferencia * 1.1;

            // Filtra as pessoas com base no rank
            return Pessoa.find({ rank: { $gte: limiteInferior, $lte: limiteSuperior } });
        })
        .then(pessoas => {
            res.render('layouts/lista', { pessoas: pessoas.map(pessoa => pessoa.toJSON()) });
        })
        .catch(erro => {
            console.error("Erro ao listar pessoas:", erro);
            req.flash('error_msg', 'Houve um erro ao listar as pessoas.');
            res.redirect('/'); // Redireciona para evitar que o usuário fique em uma página carregando indefinidamente
        });
});


router.get('/teste');

module.exports = router;
