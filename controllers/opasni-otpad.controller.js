const Otpad = require('../models/trash.model').Otpad;
const OpasniOtpad = require('../models/trash.model').OpasniOtpad;
const skladiste_controller = require('./storage.controller');

/*
    Whenever a new otpad is created it has to go into a skladiste.
 */
exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body.otpad;
    const storageID = req.body.skladiste;
    try {
        let data = await this.createMethod(newData);
        const skladiste = await skladiste_controller.readOneMethod(storageID);
        skladiste.opasniOtpad.push(data);
        skladiste.kolicina += data.kolicina;
        await skladiste_controller.updateMethod(storageID, skladiste);
        res.status(201).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.createMethod = async (data) => {
    try {
        const savedData = await Otpad.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.readMany = async (req, res) => {
    // WIP
    query = {};
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.readManyMethod = async (query) => {
    try {
        const foundData = await Otpad.find(query);
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
        const foundData = await Otpad.findById(_id);
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
    const updatingData = req.body.otpad;
    const updatingStorageID = req.body.skladiste;
    try {
        const skladiste = await skladiste_controller.readOneMethod(updatingStorageID);
        const previousAmount = skladiste.opasniOtpad.filter(x => x._id.toString() === _id)[0].kolicina;
        skladiste.kolicina = skladiste.kolicina + (updatingData.kolicina - previousAmount);
        await skladiste_controller.updateMethod(updatingStorageID, skladiste);
        const data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await Otpad.findByIdAndUpdate(_id, updatingData, {new: true});
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
    const _id = req.params.trashID;
    const storageID = req.params.storageID;
    try {
        const storage = await skladiste_controller.readOneMethod(storageID);
        const data = await this.deleteMethod(_id);
        const index =  storage.opasniOtpad.map(function(e) { return e._id; }).indexOf(data._id);
        storage.kolicina = storage.kolicina - data.kolicina;
        await skladiste_controller.updateMethod(storage._id, storage);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.deleteMethod = async (_id) => {
    try {
        const deletedData = await Otpad.findOneAndDelete({_id: _id});
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};
