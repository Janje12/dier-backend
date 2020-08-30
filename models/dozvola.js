const mongoose = require('mongoose');
const Schema = mongoose.Schema

const dozvolaSchema = Schema({
        sifra: {type: String, required: true},
        naziv: {type: String, required: false},
        datumNastanka: {type: Date, required: true},
        datumTrajanja: {type: Date, required: true},
        vrstaDozvole: {type: String, required: true},
        listaOtpada: [{type: Schema.Types.ObjectId, ref: 'Katalog', required: true}],
        skladistaTretman: {type: Schema.Types.ObjectId, ref: 'SkladisteTretman', required: false},
        skladistaDeponija: {type: Schema.Types.ObjectId, ref: 'SkladisteDeponija', required: false},
        skladistaSkladistenje: {type: Schema.Types.ObjectId, ref: 'Skladiste', required: false},
        adresa: {
            required: false,
            mesto: {type: Schema.Types.ObjectId, ref: 'Mesto'},
            ulica: {type: String},
        },
    },
);

module.exports = mongoose.model('Dozvola', dozvolaSchema);

