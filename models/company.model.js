const mongoose = require('mongoose');
const {Schema} = mongoose;

const companyClientSchema = new Schema({
    pib: {type: String, required: true, unique: true},
    mat: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    operations: [{type: String, required: true}],
    email: {type: String, required: true},
    telephone: {type: String, required: true},
    fax: {type: String, required: false},
    address: {
        location: {type: Schema.Types.ObjectId, ref: 'Location', required: true},
        street: {type: String, required: true},
    },
});

const companySchema = new Schema({
    manager: {type: String, required: true},
    emailReception: {type: String, required: true},
    legalRep: {type: String, required: true},
    occupation: {type: Schema.Types.ObjectId, ref: 'Occupation', required: true},
    permits: [{type: Schema.Types.ObjectId, ref: 'Permit', required: false}],
    vehicles: [{type: Schema.Types.ObjectId, ref: 'Vehicle', required: false}],
    storages: [{type: Schema.Types.ObjectId, ref: 'Storage', required: false}],
});

const CompanyClient = mongoose.model('CompanyClient', companyClientSchema);
const Company = CompanyClient.discriminator('Company', companySchema);

module.exports = {
    Company: Company,
    CompanyClient: CompanyClient,
};
