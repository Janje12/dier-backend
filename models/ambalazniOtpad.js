const mongoose = require('mongoose');
const Otpad = require('./otpad');

const ambalazniOtpadSchema = mongoose.Schema({
        komunalan: {type: Boolean, required: true},
    },
);

module.exports = Otpad.discriminator('AmbalazniOtpad', ambalazniOtpadSchema);

