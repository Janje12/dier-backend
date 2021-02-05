const mongoose = require('mongoose');
const {Schema} = mongoose;

const vehicleSchema = new Schema({
    type: {type: String, required: true,},
    licensePlate: {type: String, required: true, unique: true},
    licensePlateExpiration: {type: Date, required: true},
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
