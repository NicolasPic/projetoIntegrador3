const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("../models/Pessoa");
const Pessoa = mongoose.model("pessoa");

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'cpf', passwordField: 'cpf' }, async (cpf, password, done) => {
        try {
            const pessoa = await Pessoa.findOne({ cpf: cpf });
            if (!pessoa) {
                return done(null, false, { message: "Esta conta não existe" });
            }

            // Como estamos usando o CPF diretamente, não há necessidade de comparar com bcrypt
            if (pessoa.cpf === cpf) {
                return done(null, pessoa);
            } else {
                return done(null, false, { message: "Cpf não registrado" });
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((pessoa, done) => {
        done(null, pessoa.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const pessoa = await Pessoa.findById(id);
            done(null, pessoa);
        } catch (err) {
            done(err, null);
        }
    });
};