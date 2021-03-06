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
    legalRep: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
    },
    nriz: {
        username: {type: String, required: true, default: '', unique: true, select: false},
        password: {type: String, required: true, default: '', select: false},
    },
    wasteManager: {
        firstName: {type: String, required: false, default: ''},
        lastName: {type: String, required: false, default: ''},
    },
    occupation: {type: Schema.Types.ObjectId, ref: 'Occupation', required: true},
    permits: [{type: Schema.Types.ObjectId, ref: 'Permit', required: false}],
    vehicles: [{type: Schema.Types.ObjectId, ref: 'Vehicle', required: false}],
    storages: [{type: Schema.Types.ObjectId, ref: 'Storage', required: false}],
    specialWastes: [{type: Schema.Types.ObjectId, ref: 'SpecialWaste', required: false}],
});

const CompanyClient = mongoose.model('CompanyClient', companyClientSchema);
const Company = CompanyClient.discriminator('Company', companySchema);

module.exports = {
    Company: Company,
    CompanyClient: CompanyClient,
};
