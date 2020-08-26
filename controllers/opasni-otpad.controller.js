const Otpad = require('../models/otpad');
const OpasniOtpad = Otpad.OpasniOtpad;
const skladiste_controller = require('../controllers/skladiste.controller');

/*
    Whenever a new otpad is created it has to go into a skladiste.
 */
exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    const newData = req.body.otpad;
    const skladisteID = req.body.skladiste;
    try {
        let data = await this.createMethod(newData);
        const skladiste = await skladiste_controller.readOneMethod(skladisteID);
        skladiste.opasniOtpad.push(data);
        await skladiste_controller.updateMethod(skladisteID, skladiste);
        res.status(201).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.createMethod = async (data) => {
    try {
        console.log(data);
        const savedData = await OpasniOtpad.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.readMany = async (req, res) => {
    // WIP
    query = {};
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.readManyMethod = async (query) => {
    try {
        const foundData = await OpasniOtpad.find(query);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.readOne = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    _id = req.params.id;
    try {
        data = await this.readOneMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.readOneMethod = async (_id) => {
    try {
        const foundData = await OpasniOtpad.findById(_id);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.update = async (req, res) => {
    if (!req.params && !req.body) {
        res.sendStatus(400);
        return;
    }
    _id = req.params.id;
    updatingData = req.body;
    try {
        data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await OpasniOtpad.findByIdAndUpdate(_id, updatingData);
        return updatedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.delete = async (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    _id = req.params.id;
    try {
        data = await this.deleteMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.deleteMethod = async (_id) => {
    try {
        const deletedData = await OpasniOtpad.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}
