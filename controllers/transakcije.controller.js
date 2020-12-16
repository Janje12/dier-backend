const Transakcija = require('../models/transakcija');
const storageController = require('../controllers/skladiste.controller');
const jwt = require('jsonwebtoken');

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
        res.sendStatus(500);
    }
};

/* Before creating a new log check if there is already a made one and if there is update it instead */
exports.createMethod = async (data) => {
    try {
        data = new Transakcija(data);
        const savedData = await data.save();
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.readMany = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type || '';
    const value = req.params.value || '';
    const query = {};
    query[type] = value;
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.readManyMethod = async (query) => {
    try {
        const foundData = await Transakcija.find(query).populate('dko').populate('dko.firmaPrimalac');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.readOne = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const _id = req.params.id;
    try {
        const data = await this.readOneMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.readOneMethod = async (_id) => {
    try {
        const foundData = await Transakcija.findById(_id).populate('otpad');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.findOneMethod = async (query) => {
    try {
        const foundData = await Transakcija.findOne(query);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.update = async (req, res) => {
    if (!req.params && !req.body) {
        res.sendStatus(400);
        return;
    }
    const _id = req.params.id;
    const updatingData = req.body.transaction;
    try {
        const data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await Transakcija.findByIdAndUpdate(_id, updatingData);
        return updatedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.delete = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const _id = req.params.id;
    try {
        const data = await this.deleteMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.deleteMethod = async (_id) => {
    try {
        const deletedData = await Transakcija.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.findTransports = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const trashID = req.params.trashID;
    try {
        const data = await this.findTransportsMethod(trashID);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.findTransportsMethod = async (trashID) => {
    const query = {};
    query['otpad'] = trashID;
    query['vrstaTransakcije'] = 'TRASH_UPDATE';
    query['kolicinaOtpada'] = {$gt: 0};
    query['finished'] = false;
    try {
        const foundData = await Transakcija.find(query);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.findUnifinishedDump = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const trashID = req.params.trashID;
    try {
        const data = await this.findUnifinishedDumpMethod(trashID);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.findUnifinishedDumpMethod = async (trashID) => {
    const query = {};
    query['otpad'] = trashID;
    query['vrstaTransakcije'] = 'TRASH_UPDATE';
    query['kolicinaOtpada'] = {$lt: 0};
    query['nazivFirme'] = {$ne: null};
    try {
        const foundData = await Transakcija.find(query);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.getMostUsedTrash = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const token = req.headers['authorization'].split(' ')[1];
    const data = jwt.decode(token).data;
    const userID = data.korisnik._id;
    const companyID = data.firma._id;
    try {
        const data = await this.getMostUsedTrashMethod(type, userID, companyID);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.getMostUsedTrashMethod = async (type, userID, companyID) => {
    const query = {};
    let storage;
    if (type === 'production')
        storage = await storageController.findCompaniesStorageProduction(companyID);
    const storageIDs = storage.map(x => x._id);
    query['skladiste'] = {$all: storageIDs};
    query['firma'] = companyID;
    query['korisnik'] = userID;
    try {
        let foundData = await Transakcija.find(query).populate('otpad');
        foundData = foundData.filter(x => x.otpad !== null);
        let result = this.count(foundData);
        result = result.slice(0, 3);
        result = result.map(x => x.id);
        foundData = foundData.filter(
            (thing, i, arr) => arr.findIndex(t => t.otpad._id === thing.otpad._id) === i
        );
        foundData = foundData.filter(y => result.includes(y.otpad._id + ''));
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};


exports.count = (arr) => {
    let counts = {};

    for (let i = 0; i < arr.length; i++) {
        let id = arr[i].otpad._id;
        counts[id] = counts[id] ? counts[id] + 1 : 1;
    }
    const keys = Object.keys(counts);

    let countsArr = [];
    for (let i = 0; i < keys.length; i++) {
        countsArr[i] = {id: keys[i], count:counts[keys[i]]};
    }
    countsArr.sort(function(a, b) {
        return b.count - a.count;
    });

    return countsArr;
};

exports.getTransactionsByTrash = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const trashID = req.params.trashID;
    try {
        const data = await this.getTransactionsByTrashMethod(trashID);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.getTransactionsByTrashMethod = async (trashID) => {
    try {
        const foundData = await Transakcija.find({otpad: trashID}).populate('otpad');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};
