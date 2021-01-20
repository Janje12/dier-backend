const mongoose = require('mongoose');
const {Schema} = mongoose;

const locationSchema = new Schema({
        townshipCode: {type: Number, required: true},
        townshipName: {type: String, required: true},
        placeCode: {type: Number, required: true, unique: true},
        placeName: {type: String, required: true},
        zipCode: {type: String, required: false},
    }
);

module.exports = mongoose.model('Location', locationSchema);

