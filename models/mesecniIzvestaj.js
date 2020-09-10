const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mesecniIzvestajSchema = mongoose.Schema({
        godina: {type: Number, required: true, default: new Date().getFullYear()},
        mesec: {type: Number, required: true, default: new Date().getMonth()},
        otpad: {type: Schema.Types.ObjectId, ref: 'Otpad', required: true},
        skladiste: {type: Schema.Types.ObjectId, ref: 'Skladiste', required: true},
        akcijaDodaj: [{type: Schema.Types.ObjectId, ref: 'Transakcija'}],
        akcijaOduzmi: [{type: Schema.Types.ObjectId, ref: 'Transakcija'}],
    }
);

module.exports = mongoose.model('MesecniIzvestaj', mesecniIzvestajSchema);

