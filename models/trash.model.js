const mongoose = require('mongoose');
const {Schema} = mongoose;

const trashSchema = new Schema({
        indexNumber: {type: String, required: true},
        name: {type: String, required: true},
        desc: {type: String, required: true},
        amount: {type: Number, required: true, default: 0.0},
        state: {type: String, required: false},
        qList: {type: String},
        packaging: {type: String},
        rSign: {type: String, required: false},
        dSign: {type: String, required: false},
        examinationCode: {type: String, required: false},
        examinationDate: {type: Date, required: false},
    },
);

const unsafeTrashSchema = new Schema({
        hList: {type: String, required: true},
        yList: {type: String, required: true},
        cList: {type: String, required: true},
        unsafeComponent: [{
            chemicalName: {type: String, required: true},
            CAS: {type: String, required: true},
            kgOfMatter: {type: Number, required: true, default: 0.0},
        }],
    },
);

const specialWasteSchema = new Schema({
        name: {type: String, required: true},
        desc: {type: String, required: true},
        amount: {type: Number, required: true, default: 0.0},
        operationTypes: [{type: String, required: false}],
        mass: {type: Number, required: true},
        unitOfMeasure: {type: String, required: true},
    },
);

const packagingTrashSchema = new Schema({
        communal: {type: Boolean, required: true},
    },
);

const Trash = mongoose.model('Trash', trashSchema);
const SpecialWaste = mongoose.model('SpecialWaste', specialWasteSchema);
const UnsafeTrash = Trash.discriminator('UnsafeTrash', unsafeTrashSchema);
const PackagingTrash = Trash.discriminator('PackagingTrash', packagingTrashSchema);

module.exports = {
    Trash: Trash,
    UnsafeTrash: UnsafeTrash,
    SpecialWaste: SpecialWaste,
    PackagingTrash: PackagingTrash,
};
