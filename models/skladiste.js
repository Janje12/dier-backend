const mongoose = require('mongoose');
const Schema = mongoose.Schema

const skladisteSchema = Schema({
    naziv: {type: String, required: true},
    kolicina: {type: Number, required: true, default: 0.0},
    maxKolicina: {type: Number, required: true},
    adresa: {
        mesto: {type: Schema.Types.ObjectId, ref: 'Mesto', required: true, autopopulate: true},
        ulica: {type: String, required: true},
    },
    neopasniOtpad: [{type: Schema.Types.ObjectId, ref: 'Otpad', required: false}],
    opasniOtpad: [{type: Schema.Types.ObjectId, ref: 'OpasniOtpad', required: false}],
    posebniTokoviOtpada: [{type: Schema.Types.ObjectId, ref: 'PosebniTokoviOtpada', required: false}],
    ambalazniOtpad: [{type: Schema.Types.ObjectId, ref: 'AmbalazniOtpad', required: false}],
    ambalaze: [{type: Schema.Types.ObjectId, ref: 'Ambalaza', required: false}],
});
const skladisteTretmanSchema = Schema({
    geolokacijaN: {required: true, type: Number},
    geolokacijaE: {required: true, type: Number},
});

const Skladiste = mongoose.model('Skladiste', skladisteSchema);
const SkladisteTretman = Skladiste.discriminator('SkladisteTretman', skladisteTretmanSchema);

module.exports = {
    Skladiste: Skladiste,
    SkladisteTretman: SkladisteTretman,
};
