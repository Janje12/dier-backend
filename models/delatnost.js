const mongoose = require('mongoose');

const delatnostSchema = mongoose.Schema({
    sifra: {type: String, required: true, unique: true},
    naziv: {type: String, required: true},
});

module.exports = mongoose.model('Delatnost', delatnostSchema);
