const mongoose = require('mongoose');
const Schema = mongoose.Schema

const otpadSchema = Schema({
        indeksniBroj: {type: String, required: true},
        naziv: {type: String, required: true},
        opis: {type: String, required: true},
        kolicina: {type: Number, required: true, default: 0.0},
        fizickoStanje: {type: String, required: false},
        qLista: {type: String},
        nacinPakovanja: {type: String},
        tretman: {type: Boolean, required: false},
    },
);
const opasniOtpadSchema = Schema({
        hLista: {type: String, required: true},
        yLista: {type: String, required: true},
        cLista: {type: String, required: true},
        hemijskiNaziv: {type: String, required: true},
        cas: {type: String, required: true},
        kgMaterije: {type: Number, required: true, default: 0.0},
    },
);

const Otpad = mongoose.model('Otpad', otpadSchema);
const OpasniOtpad = Otpad.discriminator('OpasniOtpad', opasniOtpadSchema);

module.exports = {
    Otpad: Otpad,
    OpasniOtpad: OpasniOtpad,
};
