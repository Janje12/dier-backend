const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const godisnjiIzvestajSchema = mongoose.Schema({
        vrsta: {type: String, required: true},
        godina: {type: Number, required: true, default: new Date().getFullYear()},
        otpad: {type: Schema.Types.ObjectId, ref: 'Otpad', required: true},
        firma: {type: Schema.Types.ObjectId, ref: 'Firma', required: true},
        skladiste: {type: Schema.Types.ObjectId, ref: 'Skladiste', required: true},
        mesecniIzvestaj: [{type: Schema.Types.ObjectId, ref: 'MesecniIzvestaj', required: true}],
        ukupnoProizvodnja: {type: Number, required: true},
        ukupnoStanje: {type: Number, required: true},
    }
);

module.exports = mongoose.model('GodisnjiIzvestaj', godisnjiIzvestajSchema);

