const mongoose = require('mongoose');

const ambalazaSchema = mongoose.Schema({
    naziv: {type: String, required: true},
    opis: {type: String, required: true},
    kolicina: {type: Number, required: true, default: 0.0},
    povratna: {type: Boolean, required: true},
});

module.exports = mongoose.model('Ambalaza', ambalazaSchema);
