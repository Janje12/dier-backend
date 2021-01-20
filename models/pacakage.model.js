const mongoose = require('mongoose');
const {Schema} = mongoose;

const packageSchema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    amount: {type: Number, required: true, default: 0.0},
    reusable: {type: Boolean, required: true},
});

module.exports = mongoose.model('Package', packageSchema);
