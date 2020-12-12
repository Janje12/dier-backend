const Transakcija = require('../models/transakcija');

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
        const foundData = await Transakcija.findById(_id);
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
        console.log(updatingData);
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
