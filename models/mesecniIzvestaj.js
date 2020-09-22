const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mesecniIzvestajSchema = mongoose.Schema({
        godina: {type: Number, required: true, default: new Date().getFullYear()},
        mesec: {type: Number, required: true, default: new Date().getMonth()},
        otpad: {type: Schema.Types.ObjectId, ref: 'Otpad', required: true},
        skladiste: {type: Schema.Types.ObjectId, ref: 'Skladiste', required: true},
        dnevniIzvestaj: [{type: Schema.Types.ObjectId, ref: 'DnevniIzvestaj', required: true}],
        ukupnoProizvodnja: {type: Number, required: true},
        ukupnoTransport: {type: Number, required: true},
        ukupnoStanje: {type: Number, required: true},
    }
);

module.exports = mongoose.model('MesecniIzvestaj', mesecniIzvestajSchema);

