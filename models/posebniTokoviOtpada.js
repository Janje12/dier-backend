const mongoose = require('mongoose');
const OpasniOtpad = require('./opasniOtpad');

const posebniTokoviOtpadaSchema = mongoose.Schema({
        masa: {type: Number, required: true},
        jedinicaMere: {type: String, required: true},
    },
);

module.exports = OpasniOtpad.discriminator('PosebniTokoviOtpada', posebniTokoviOtpadaSchema);

