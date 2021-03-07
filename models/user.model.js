const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    phone: {type: String, required: true},
    role: {type: String, required: true},
    company: {type: Schema.Types.ObjectId, ref: 'Company', required: false},
    verified: {type: Boolean, required: true, default: false},
    verificationToken: {type: String, required: false},
    token: {type: String, required: false},
});

module.exports = mongoose.model('User', userSchema);
