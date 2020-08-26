const mongoose = require('mongoose');

const katalogSchema = mongoose.Schema({
    indeksniBroj: {type: String, required: true, unique: true},
    naziv: {type: String, required: true},
});

module.exports = mongoose.model('Katalog', katalogSchema);
