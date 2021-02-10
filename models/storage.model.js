const mongoose = require('mongoose');
const {Schema} = mongoose;

const storageSchema = new Schema({
    name: {type: String, required: true},
    address: {
        location: {type: Schema.Types.ObjectId, ref: 'Location', required: true},
        street: {type: String, required: true},
    },
    geolocationNorth: {required: false, type: Number},
    geolocationEast: {required: false, type: Number},
    amount: {type: Number, required: true, default: 0.0},
    maxAmount: {type: Number, required: true},
    trashes: [{type: Schema.Types.ObjectId, ref: 'Trash', required: false}],
    packages: [{type: Schema.Types.ObjectId, ref: 'Package', required: false}],

});
const storageTreatmentSchema = new Schema({
    treatment: {type: String, required: true},
});
const storageDumpSchema = new Schema({
    dumpType: {type: String, required: true},
});
const storageCacheSchema = new Schema({
    cache: {type: String, required: true},
});

const Storage = mongoose.model('Storage', storageSchema);
const StorageTreatment = Storage.discriminator('StorageTreatment', storageTreatmentSchema);
const StorageDump = Storage.discriminator('StorageDump', storageDumpSchema);
const StorageCache = Storage.discriminator('StorageCache', storageCacheSchema);

module.exports = {
    Storage: Storage,
    StorageTreatment: StorageTreatment,
    StorageDump: StorageDump,
    StorageCache: StorageCache,
};
