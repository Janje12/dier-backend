const mongoose = require('mongoose');
const {Schema} = mongoose;

const permitSchema = new Schema({
        name: {type: String, required: false},
        code: {type: String, required: true},
        dateCreation: {type: Date, required: true},
        dateExpiration: {type: Date, required: true},
        type: {type: String, required: true},
        trashList: [{type: Schema.Types.ObjectId, ref: 'Catalog', required: true}],
        storage: {type: Schema.Types.ObjectId, ref: 'Storage', required: false},
        address: {
            required: false,
            location: {type: Schema.Types.ObjectId, ref: 'Location'},
            street: {type: String},
        },
    },
);

module.exports = mongoose.model('Permit', permitSchema);

