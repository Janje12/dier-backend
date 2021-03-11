const TrashModel = require('../models/trash.model').Trash;
const UnsafeTrashModel = require('../models/trash.model').UnsafeTrash;
const storageController = require('./storage.controller');

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body.trash;
    const storageID = req.body.storageID;
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
        if (data.hList !== undefined)
            data = new UnsafeTrashModel(data);
        else
            data = new TrashModel(data);
        const savedData = await data.save();
        const storage = await storageController.readOneMethod({'_id': storageID});
        storage.trashes.push(data);
        if (storage.storageUnit === 'T')
            storage.amount += data.amount / 1000;
        else
            storage.amount += data.amount;
        await storageController.updateOneMethod({'_id': storageID}, storage);
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
    if (!req.body || !req.params.type || !req.params.value || !req.body.storageID) {
        res.sendStatus(400);
        return;
    }
    const updatingStorageID = req.body.storageID;
    const updatingData = req.body.trash;
    const increment = req.body.inc;
    const type = req.params.type;
    const value = req.params.value;
    let query = {};
    query[type] = value;
    try {
        const data = await this.updateOneMethod(query, updatingData, updatingStorageID, increment);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

/* Trash has to be added/subtraced from storage as well */ // MAKE BETTER!
exports.updateOneMethod = async (query, updatingData, updatingStorageID, increment = false) => {
    try {
        const storage = await storageController.readOneMethod({'_id': updatingStorageID});
        const previousTrash = await this.readOneMethod(query);
        console.log(query);
        let updatedData = null;
        if (previousTrash === null) {
            updatedData = await this.createMethod(updatingData, updatingStorageID);
        } else {
            // Update by incrementing the trash amount or update everything!
            if (increment) {
                updatedData = await TrashModel.findOneAndUpdate(query, {$inc: {amount: updatingData.amount}}, {new: true});
            } else {
                updatedData = await TrashModel.findOneAndUpdate(query, updatingData, {new: true});
            }
            storage.amount += updatedData.amount - previousTrash.amount;
            await storageController.updateOneMethod({'_id': updatingStorageID}, storage);
        }
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
        const data = await this.deleteOneMethod(query, storageID);
        res.status(200).json(data);
    } catch (err) {
        console.log('[REQUEST-ERROR]: ', err);
        res.sendStatus(500);
    }
};

exports.deleteOneMethod = async (query, storageID) => {
    try {
        const deletedData = await TrashModel.findOneAndDelete(query);
        const storage = await storageController.readOneMethod({'_id': storageID});
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
