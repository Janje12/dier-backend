const mongoose = require('mongoose');
const Otpad = require('./otpad');

const opasniOtpadSchema = mongoose.Schema({
        hLista: {type: String, required: true},
        yLista: {type: String, required: true},
        cLista: {type: String, required: true},
        hemijskiNaziv: {type: String, required: true},
        cas: {type: String, required: true},
        kgMaterije: {type: Number, required: true, default: 0.0},
    },
);
