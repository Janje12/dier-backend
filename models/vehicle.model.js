const mongoose = require('mongoose');
const {Schema} = mongoose;

const vehicleSchema = new Schema({
    type: {type: String, required: true,},
    registrationNumber: {type: String, required: true, unique: true},
    registrationExpiration: {type: Date, required: true},
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
