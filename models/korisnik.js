const mongoose = require('mongoose');
const Schema = mongoose.Schema

const korisnikSchema = Schema({
    ime: {type: String, required: true},
    prezime: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    korisnickoIme: {type: String, required: true, unique: true},
    sifra: {type: String, required: true},
    telefon: {type: String, required: true},
    uloga: {type: String, required: true},
    firma: {type: Schema.Types.ObjectId, ref: 'Firma', required: false},
    token: {type: String, required: false},
});

module.exports = mongoose.model('Korisnik', korisnikSchema);
