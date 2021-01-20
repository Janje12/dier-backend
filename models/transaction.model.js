const mongoose = require('mongoose');
const {Schema} = mongoose;

const transactionSchema = new Schema({
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        company: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
        date: {type: Date, required: true, default: Date.now()},
        transactionType: {type: String, required: true},
        method: {type: String, required: true},
        trash: {type: Schema.Types.ObjectId, ref: 'Trash', required: false},
        storage: {type: Schema.Types.ObjectId, ref: 'Storage', required: false},
        trashAmount: {type: Number, required: false},
        previousAmount: {type: Number, required: false},
        currentAmount: {type: Number, required: false},
        companyName: {type: String, required: false},
        wmdNo: {type: String, required: false},
        sign: {type: String, required: false},
        wmd: {type: Schema.Types.ObjectId, ref: 'WMD', required: false},
        finished: {type: Boolean, required: false},
    },
);

module.exports = mongoose.model('Transaction', transactionSchema);
