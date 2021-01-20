const TrashModel = require('../models/trash.model').Otpad;
const storageController = require('./storage.controller');

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body.otpad;
    const storageID = req.body.skladiste;
    try {
        let data = await this.createMethod(newData, storageID);
        res.status(201).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR] ', err);
        res.sendStatus(500);
    }
};
/*
 Whenever a new trash is created it has to go into the specified storage.
 */
exports.createMethod = async (data, storageID) => {
    try {
        data = new TrashModel(data);
        const savedData = await data.save();
        const storage = await storageController.readOneMethod(storageID);
        storage.trashes.push(data);
        storage.amount += data.amount;
        await storageController.updateMethod(storageID, storage);
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
        const foundData = await TrashModel.findOne(query);
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
        const foundData = await TrashModel.find(query);
        return foundData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.updateOne = async (req, res) => {
    if (!req.body || !req.params.type || !req.params.value || !req.params.storageID) {
        res.sendStatus(400);
        return;
    }
    const updatingStorageID = req.body.storageID;
    const updatingData = req.body;
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.updateMethod(query, updatingData, updatingStorageID);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

/* Trash has to be added/subtraced from storage as well */
exports.updateOneMethod = async (query, updatingData, updatingStorageID) => {
    try {
        const updatedData = await TrashModel.findOneAndUpdate(query, updatingData, {new: true});
        const storage = await storageController.readOneMethod(updatingStorageID);
        let previousAmount = 0;
        previousAmount = storage.trashes.filter(x => x._id.toString() === _id)[0].amount;
        storage.amount += (updatingData.amount - previousAmount);
        await storageController.updateMethod(updatingStorageID, storage);
        return updatedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

/* Trash has to be removed in the storage refrence as well */
exports.deleteOne = async (req, res) => {
    if (!req.params.type || !req.params.value || !req.params.storageID) {
        res.sendStatus(400);
        return;
    }
    const storageID = req.params.storageID;
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.deleteMethod(query, storageID);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.deleteOneMethod = async (query, storageID) => {
    try {
        const deletedData = await TrashModel.findOneAndDelete(query);
        const storage = await storageController.readOneMethod(storageID);
        const index = storage.trashes.map(function (e) {
            return e._id;
        }).indexOf(deletedData._id);
        storage.trashes.splice(index, 1);
        storage.amount -= deletedData.amount;
        await storageController.updateOneMethod({'_id': storageID}, storage);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};
