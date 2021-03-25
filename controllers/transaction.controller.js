const TransactionModel = require('../models/transaction.model');
const companyController = require('./company.controller');
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
        data = new TransactionModel(data);
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
        const foundData = await TransactionModel.findOne(query).populate('trash').populate('user');
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
        const foundData = await TransactionModel.find(query).populate('trash').populate('user')
            .populate('specialWaste');
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
        const updatedData = await TransactionModel.findOneAndUpdate(query, updatingData);
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
        const updatedData = await TransactionModel.updateMany(query, updatingData);
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
        const deletedData = await TransactionModel.findOneAndDelete(query);
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
        const deletedData = await TransactionModel.deleteMany(query);
        return deletedData;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

// GET all the Transactions[] where the Trash was transported
exports.readTransportTransactions = async (req, res) => {
    if (!req.params.trashID) {
        res.sendStatus(400);
        return;
    }
    const trashID = req.params.trashID;
    try {
        const data = await this.readTransportTransactionsMethod(trashID);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

// To find only the transport of trash it has to be an UPDATE and >0 and not flagged as a finished transaction
// (meaning the user still has to do something with it e.g. process or dump)
exports.readTransportTransactionsMethod = async (trashID) => {
    const query = {};
    query['trash'] = trashID;
    query['transactionType'] = 'TRASH_UPDATE';
    query['trashAmount'] = {$gt: 0};
    query['finished'] = false;
    try {
        const foundData = await TransactionModel.find(query);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.readUnifinshedTransactions = async (req, res) => {
    if (!req.params.trashID || !req.params.companyID) {
        res.sendStatus(400);
        return;
    }
    const trashID = req.params.trashID;
    let companyID = req.params.companyID;
    try {
        const data = await this.readUnifinshedTransactionsMethod(trashID, companyID);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
// Do this better
exports.readUnifinshedTransactionsMethod = async (trashID, companyID) => {
    const query = {};
    let storage = undefined;
    if (trashID === 'treatment')
        storage = await companyController.readCompaniesStoragesMethod(companyID, 'treatment');
    else if (trashID === 'disposal')
        storage = await companyController.readCompaniesStoragesMethod(companyID, 'disposal');
    else
        query['trash'] = trashID;
    if (storage !== undefined) {
        const storageIDs = storage.map(x => x._id);
        query['storage'] = {$all: storageIDs};
    }
    query['transactionType'] = 'TRASH_UPDATE';
    query['finished'] = false;
    query['companyName'] = {$ne: null};
    try {
        const foundData = await this.readManyMethod(query);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};
// Get the most used trash of that operation type for the company and user that requested it
exports.readMostUsedTrash = async (req, res) => {
    if (!req.params.operationType) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.operationType;
    const count = req.params.count ? req.params.count : 5;
    const {data, exp} = await tokenController.extractUserInfo(req.headers);
    const userID = data.user._id;
    const companyID = data.company._id;
    try {
        const data = await this.readMostUsedTrashMethod(type, userID, companyID, count);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

// FML fix this
exports.readMostUsedTrashMethod = async (type, userID, companyID, count) => {
    const query = {};
    const storage = await companyController.readCompaniesStoragesMethod(companyID, type);
    const storageIDs = storage.map(x => x._id);
    query['storage'] = {$in: storageIDs};
    query['company'] = companyID;
    query['user'] = userID;
    query['transactionType'] = 'TRASH_UPDATE';
    try {
        let foundData = await this.readManyMethod(query);
        foundData = foundData.filter(x => x.trash !== null);
        let result = this.count(foundData);
        result = result.slice(0, count);
        result = result.map(x => x.id);
        foundData = foundData.filter(
            (thing, i, arr) => arr.findIndex(t => t.trash._id === thing.trash._id) === i
        );
        foundData = foundData.filter(y => result.includes(y.trash._id + ''));
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.readMostUsedSpecialWaste = async (req, res) => {
    if (!req.params.operationType) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.operationType;
    const count = req.params.count ? req.params.count : 5;
    const {data} = await tokenController.extractUserInfo(req.headers);
    const userID = data.user._id;
    const companyID = data.company._id;
    try {
        const data = await this.readMostUsedSpecialWasteMethod(type, userID, companyID, count);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
// FML fix this
exports.readMostUsedSpecialWasteMethod = async (type, userID, companyID, count) => {
    const query = {};
    query['company'] = companyID;
    query['user'] = userID;
    query['transactionType'] = 'SPECIAL_WASTE_UPDATE';
    try {
        let foundData = await this.readManyMethod(query);
        foundData = foundData.filter(x => x.specialWaste !== null);
        let result = this.count(foundData, 'specialWaste');
        result = result.slice(0, count);
        result = result.map(x => x.id);
        foundData = foundData.filter(
            (thing, i, arr) => arr.findIndex(t => t.specialWaste._id === thing.specialWaste._id) === i
        );
        foundData = foundData.filter(y => result.includes(y.specialWaste._id + ''));
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.count = (arr, type = 'trash') => {
    let counts = {};

    for (let i = 0; i < arr.length; i++) {
        let id = arr[i][type]._id;
        counts[id] = counts[id] ? counts[id] + 1 : 1;
    }
    const keys = Object.keys(counts);

    let countsArr = [];
    for (let i = 0; i < keys.length; i++) {
        countsArr[i] = {id: keys[i], count: counts[keys[i]]};
    }
    countsArr.sort(function (a, b) {
        return b.count - a.count;
    });

    return countsArr;
};
