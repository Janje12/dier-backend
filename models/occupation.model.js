const mongoose = require('mongoose');
const {Schema} = mongoose;

const occupationSchema = new Schema({
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true},
});

module.exports = mongoose.model('Occupation', occupationSchema);
