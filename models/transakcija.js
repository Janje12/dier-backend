const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transkacijaSchema = Schema({
        datum: {type: Date, required: true, default: Date.now()},
        vrstaTransakcije: {type: String, required: true},
        metoda: {type: String, required: true},
        otpad: {type: Schema.Types.ObjectId, ref: 'Otpad', required: false},
        korisnik: {type: Schema.Types.ObjectId, ref: 'Korisnik', required: true},
        firma: {type: Schema.Types.ObjectId, ref: 'Firma', required: false},
        skladiste: {type: Schema.Types.ObjectId, ref: 'Skladiste', required: false},
        kolicinaOtpada: {type: Number, required: false},
        prethodnaKolicina: {type: Number, required: false},
        trenutnaKolicina: {type: Number, required: false},
        dko: {type: Schema.Types.ObjectId, ref: 'DKO', required: false},
        nazivFirme: {type: String, required: false},
        brojDKO: {type: String, required: false},
        nacinPostupanja: {type: String, required: false},
    },
);


module.exports = mongoose.model('Transakcija', transkacijaSchema);
