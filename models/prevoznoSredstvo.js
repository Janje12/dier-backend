const mongoose = require('mongoose');
const Schema = mongoose.Schema

const prevoznoSredstvoSchema = Schema({
    vrstaVozila: {type: String, required: true,},
    registarskiBroj: {type: String, required: true, unique: true},
})

module.exports = mongoose.model('PrevoznoSredstvo', prevoznoSredstvoSchema);
