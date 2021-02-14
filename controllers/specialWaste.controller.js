const SpecialWasteModel = require('../models/trash.model').SpecialWaste;

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body.trash;
    try {
        let data = await this.createMethod(newData);
        res.status(201).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};

exports.createMethod = async (data) => {
    try {
        data = new SpecialWasteModel(data);
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
        const foundData = await SpecialWasteModel.findOne(query);
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
        const foundData = await SpecialWasteModel.find(query);
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
    const updatingData = req.body.specialWaste;
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
        const updatedData = await SpecialWasteModel.findOneAndUpdate(query, updatingData, {new: true});
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
        const deletedData = await SpecialWasteModel.findOneAndDelete(query);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
