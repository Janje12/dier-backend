require('dotenv').config();
const CompanyModel = require('../models/company.model').Company;
// Use CompanyClient because its the top level class
const permitController = require('./permit.controller.js');
const storageController = require('./storage.controller.js');
const vehicleController = require('./vehicle.controller');
const specialWasteController = require('./specialWaste.controller');
const tokenController = require('./token.controller');

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body;
    try {
        const data = await this.createMethod(newData);
        res.status(201).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.createMethod = async (data) => {
    try {
        if (data.nriz.password !== '')
            data.nriz.password = await tokenController.encrypt(data.nriz.password);
        data = new CompanyModel(data);
        const savedData = await data.save();
        return savedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.readOne = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const data = await this.readOneMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.readOneMethod = async (query, options = '') => {
    try {
        const foundData = await CompanyModel.findOne(query).select(options).populate('permits').populate('address.location')
            .populate('vehicles').populate('storages').populate('specialWastes');
        if (options.includes('password')) {
            foundData.nriz.password = await tokenController.decrypt(foundData.nriz.password);
        }
        return foundData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.readMany = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value) {
        const type = req.params.type;
        const value = req.params.value;
        query[type] = value;
    }
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.readManyMethod = async (query) => {
    try {
        const foundData = await CompanyModel.find(query);
        return foundData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.readOnlyNamesMethod = async (query) => {
    try {
        const foundData = await CompanyModel.find(query).select('name storages permits');
        return foundData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.updateOne = async (req, res) => {
    if (!req.body || !req.params.type || !req.params.value) {
        res.sendStatus(400);
        return;
    }
    const updatingData = req.body;
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.updateOneMethod(query, updatingData);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.updateOneMethod = async (query, updatingData) => {
    try {
        const updatedData = await CompanyModel.findOneAndUpdate(query, updatingData);
        return updatedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.updateMany = async (req, res) => {
    if (!req.body || !req.params.type || !req.params.value) {
        res.sendStatus(400);
        return;
    }
    const updatingData = req.body;
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.updateMethod(query, updatingData);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.updateManyMethod = async (query, updatingData) => {
    try {
        const updatedData = await CompanyModel.updateMany(query, updatingData);
        return updatedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.deleteOne = async (req, res) => {
    if (!req.params.type || !req.params.value) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.deleteOneMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};
// delete vehicles/permits/storages/specialwastes
exports.deleteOneMethod = async (query) => {
    try {
        const deletedData = await CompanyModel.findOneAndDelete(query);
        for (const storage of deletedData.storages)
            await storageController.deleteOneMethod({'_id': storage});
        for (const vehicle of deletedData.vehicles)
            await vehicleController.deleteOneMethod({'_id': vehicle});
        for (const permit of deletedData.permits)
            await permitController.deleteOneMethod({'_id': permit});
        for (const specialWaste of deletedData.specialWastes)
            await specialWasteController.deleteOneMethod({'_id': specialWaste});
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.deleteMany = async (req, res) => {
    if (!req.params.type || !req.params.value) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.deleteMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.deleteManyMethod = async (query) => {
    try {
        const deletedData = await CompanyModel.deleteMany(query);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
/* Get all the permits (of permit type) from the companies ID
 or all if permit type isn't specified */
exports.readCompaniesPermits = async (req, res) => {
    if (!req.params.companyID) {
        res.sendStatus(400);
        return;
    }
    const companyID = req.params.companyID;
    const permitType = req.params.permitType ? req.params.permitType : '';
    try {
        const company = await this.readOneMethod({'_id': companyID});
        let permits = company.permits;
        if (permitType === 'treatment')
            permits = permits.filter(d => d.type === 'treatment');
        else if (permitType === 'cache')
            permits = permits.filter(d => d.type === 'cache');
        else if (permitType === 'dump')
            permits = permits.filter(d => d.type === 'dump');
        else if (permitType === 'collector')
            permits = permits.filter(d => d.type === 'collector');
        else if (permitType === 'transport')
            permits = permits.filter(d => d.type === 'transport');
        for (let i = 0; i < permits.length; i++) {
            permits[i] = await permitController.readOneMethod({'_id': permits[i]._id});
        }
        res.status(200).json(permits);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};
/* Get all the companies vehicles */
exports.readCompaniesVehicles = async (req, res) => {
    if (!req.params.companyID) {
        res.sendStatus(400);
        return;
    }
    const companyID = req.params.companyID;
    try {
        const company = await this.readOneMethod({'_id': companyID});
        let vehicles = company.vehicles;
        res.status(200).json(vehicles);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};
/* Get all the companies storages of storageType (if unspecified then all of them) */
exports.readCompaniesStorages = async (req, res) => {
    if (!req.params.companyID) {
        res.sendStatus(404);
        return;
    }
    const companyID = req.params.companyID;
    const storageType = req.params.storageType ? req.params.storageType : '';
    try {
        const storages = await this.readCompaniesStoragesMethod(companyID, storageType);
        res.status(200).json(storages);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.readCompaniesStoragesMethod = async (companyID, storageType) => {
    try {
        const company = await this.readOneMethod({'_id': companyID});
        let storages = company.storages;
        if (storageType === 'treatment')
            storages = storages.filter(s => s.__t === 'StorageTreatment');
        else if (storageType === 'cache')
            storages = storages.filter(s => s.__t === 'StorageCache');
        else if (storageType === 'dump')
            storages = storages.filter(s => s.__t === 'StorageDump');
        else if (storageType === 'production')
            storages = storages.filter(s => s.__t === undefined);
        for (let i = 0; i < storages.length; i++) {
            storages[i] = await storageController.readOneMethod(storages[i]._id);
        }
        return storages;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
/* Get all the companies storages of storageType (if unspecified then all of them) */
exports.readCompaniesSpecialWastes = async (req, res) => {
    if (!req.params.companyID) {
        res.sendStatus(404);
        return;
    }
    const companyID = req.params.companyID;
    const specialWasteType = req.params.specialWasteType ? req.params.specialWasteType : '';
    try {
        const storages = await this.readCompaniesSpecialWastesMethod(companyID, specialWasteType);
        res.status(200).json(storages);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.readCompaniesSpecialWastesMethod = async (companyID, specialWasteType) => {
    try {
        const company = await this.readOneMethod({'_id': companyID});
        let specialWastes = company.specialWastes;
        if (specialWasteType === 'production')
            specialWastes = specialWastes.filter(s => s.operationTypes.includes('Proizvodnja'));
        else if (specialWasteType === 'import')
            specialWastes = specialWastes.filter(s => s.operationTypes.includes('Uvoz'));
        else if (specialWasteType === 'export')
            specialWastes = specialWastes.filter(s => s.operationTypes.includes('Izvoz'));
        return specialWastes;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
