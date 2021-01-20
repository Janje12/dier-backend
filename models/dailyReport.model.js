const mongoose = require('mongoose');
const {Schema} = mongoose;

const dnevniIzvestajSchema = new Schema({
        godina: {type: Number, required: true, default: new Date().getFullYear()},
        mesec: {type: Number, required: true, default: new Date().getMonth()},
        dan: {type: Number, required: true, default: new Date().getDate()},
        otpad: {type: Schema.Types.ObjectId, ref: 'Otpad', required: true},
        skladiste: {type: Schema.Types.ObjectId, ref: 'Skladiste', required: true},
        akcijaProizvodnja: [{type: Schema.Types.ObjectId, ref: 'Transakcija'}],
        akcijaTransport: [{type: Schema.Types.ObjectId, ref: 'Transakcija'}],
        ukupnoProizvodnja: {type: Number, required: true},
        ukupnoTransport: {type: Number, required: true},
        ukupnoStanje: {type: Number, required: true},
        dko: {type: Schema.Types.ObjectId, ref: 'DKO', required: false},
        rLista: {type: String, required: false},
        dLista: {type: String, required: false},
        sakupljac: {type: String, required: false},
        tretman: {type: String, required: false},
        odlagac: {type: String, required: false},
        brojDozvole: {type: String, required: false},
        nazivFirme: {type: String, required: false},
        klasaDeponije: {type: String, required: false},
    }
);

module.exports = mongoose.model('DnevniIzvestaj', dnevniIzvestajSchema);

