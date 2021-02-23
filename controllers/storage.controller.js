const StorageModel = require('../models/storage.model').Storage;
const StorageTreatmentModel = require('../models/storage.model').StorageTreatment;
const StorageDumpModel = require('../models/storage.model').StorageDump;
const StorageCacheModel = require('../models/storage.model').StorageCache;

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
        if (data.treatment !== undefined)
            data = new StorageTreatmentModel(data);
        else if (data.dumpType !== undefined)
            data = new StorageDumpModel(data);
        else if (data.cache !== undefined)
            data = new StorageCacheModel(data);
        else
            data = new StorageModel(data);
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

exports.readOneMethod = async (query) => {
    try {
        const foundData = await StorageModel.findOne(query).populate('trashes').populate('address.location');
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
        const foundData = await StorageModel.find(query).populate('trashes').populate('address.location');
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
        const updatedData = await StorageModel.findOneAndUpdate(query, updatingData);
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
        const data = await this.updateManyMethod    (query, updatingData);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.updateManyMethod = async (query, updatingData) => {
    try {
        const updatedData = await StorageModel.updateMany(query, updatingData);
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
        const deletedData = await StorageModel.findOneAndDelete(query);
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
        const deletedData = await StorageModel.deleteMany(query);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
