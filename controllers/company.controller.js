const CompanyModel = require('../models/company.model').CompanyClient;
// Use CompanyClient because its the top level class
const permitController = require('./permit.controller.js');
// const vehicleController = require('vehicle.controller');
const storageController = require('./storage.controller.js');

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
        console.log(query);
        const data = await this.readOneMethod(query);
        console.log(data);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.readOneMethod = async (query) => {
    try {
        const foundData = await CompanyModel.findOne(query);
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
        const data = await this.updateMethod(query, updatingData);
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
        const data = await this.deleteMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.deleteOneMethod = async (query) => {
    try {
        const deletedData = await CompanyModel.findOneAndDelete(query);
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
            permits = permits.filter(d => d.type !== 'cache');
        else if (permitType === 'dump')
            permits = permits.filter(d => d.type !== 'dump');
        else if (permitType === 'transport')
            permits = permits.filter(d => d.type !== 'transport');
        for (let i = 0; i <= permits.length; i++)
            permits[i] = await permitController.readOneMethod(permits[i]._id);
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
