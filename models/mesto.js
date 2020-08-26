const mongoose = require('mongoose');

const mestoSchema = mongoose.Schema({
        mestoSifra: {type: Number, required: true, unique: true},
        mestoNaziv: {type: String, required: true},
        opstinaSifra: {type: Number, required: true},
        opstinaNaziv: {type: String, required: true},
        postanskiBroj: {type: String, unique: true, required: false},
    }
);

module.exports = mongoose.model('Mesto', mestoSchema);

