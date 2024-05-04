const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Pessoa = new Schema({
nome: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true
},
cpf: {
    type: String,
    required: true
},
velocidade: {
    type: Number,
    required: false
},
agilidade: {
    type: Number,
    required: false
},
forca: {
    type: Number,
    required: false
},
rank: {
    type: Number,
    required: false
},
camp: {
    type: Number,
    required: false
}

})


mongoose.model("pessoa",Pessoa)