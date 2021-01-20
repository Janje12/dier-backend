const mongoose = require('mongoose');
const {Schema} = mongoose;

const catalogSchema = new Schema({
    indexNumber: {type: String, required: true, unique: true},
    name: {type: String, required: true},
});

module.exports = mongoose.model('Catalog', catalogSchema);
