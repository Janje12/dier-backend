const mongoose = require('mongoose');
const {Schema} = mongoose;

const catalogSchema = new Schema({
    indexNumber: {type: String, required: true, unique: true},
    name: {type: String, required: true},
});

const specialWasteCatalogSchema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    class: {type: String, required: true},
});

const Catalog = mongoose.model('Catalog', catalogSchema);
const SpecialWasteCatalog = mongoose.model('specialWasteCatalog', specialWasteCatalogSchema);

module.exports = {
    Catalog: Catalog,
    SpecialWasteCatalog: SpecialWasteCatalog,
};
