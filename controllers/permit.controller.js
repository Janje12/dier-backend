const PermitModel = require('../models/permit.model');
const companyController = require('./company.controller');

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body.permit;
    const companyID = req.body.companyID;
    try {
        const data = await this.createMethod(newData, companyID);
        res.status(201).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.createMethod = async (data, companyID) => {
    try {
        data = new PermitModel(data);
        const savedData = await data.save();
        if (companyID !== undefined) {
            const company = await companyController.readOneMethod({'_id': companyID});
            company.permits.push(savedData);
            await companyController.updateOneMethod({'_id': companyID}, company);
        }
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

exports.readOneMethod = async (query) => {
    try {
        const foundData = await PermitModel.findOne(query).populate('trashList')
            .populate('storage').populate('address.location');
        return foundData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.readMany = async (req, res) => {
    let query = {};
    if (req.params.type && req.params.value && req.params.value !== 'all') {
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
        const foundData = await PermitModel.find(query).populate('address.location');
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
        const updatedData = await PermitModel.findOneAndUpdate(query, updatingData);
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
        const updatedData = await PermitModel.updateMany(query, updatingData);
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

exports.deleteOneMethod = async (query) => {
    try {
        const deletedData = await PermitModel.findOneAndDelete(query);
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
        const data = await this.deleteManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.deleteManyMethod = async (query) => {
    try {
        const deletedData = await PermitModel.deleteMany(query);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
