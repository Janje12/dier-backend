const mongoose = require('mongoose');
const Schema = mongoose.Schema

const firmaSchema = Schema({
    pib: {type: String, required: true, unique: true},
    mat: {type: String, required: true, unique: true},
    naziv: {type: String, required: true},
    email: {type: String, required: true},
    faks: {type: String, required: false},
    emailPrijem: {type: String, required: true},
    telefon: {type: String, required: true},
    radFirme: [{type: String, required: true}],
    zakonskiZastupnik: {type: String, required: true},
    adresa: {
        mesto: {type: Schema.Types.ObjectId, ref: 'Mesto', required: true},
        ulica: {type: String, required: true},
    },
    delatnost: {type: Schema.Types.ObjectId, ref: 'Delatnost', required: true},
    dozvola: [{type: Schema.Types.ObjectId, ref: 'Dozvola'}],
    prevoznoSredstvo: [{type: Schema.Types.ObjectId, ref: 'PrevoznoSredstvo'}],
    menadzer: {type: String},
    skladista: [{type: Schema.Types.ObjectId, ref: 'Skladiste'}],
    skladistaTretman: [{type: Schema.Types.ObjectId, ref: 'SkladisteTretman'}],
});

module.exports = mongoose.model('Firma', firmaSchema);
