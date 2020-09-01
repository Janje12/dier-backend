const Otpad = require('../models/otpad').Otpad;
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
        skladiste.neopasniOtpad.push(data);
        skladiste.kolicina += data.kolicina;
        await skladiste_controller.updateMethod(skladisteID, skladiste);
        res.status(201).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

exports.createMethod = async (data) => {
    try {
        const savedData = await Otpad.create(data);
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
        const foundData = await Otpad.find(query);
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
        const foundData = await Otpad.findById(_id);
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
    updatingData = req.body.otpad;
    updatingStorageID = req.body.skladiste;
    try {
        const skladiste = await skladiste_controller.readOneMethod(updatingStorageID);
        const previousAmount = skladiste.neopasniOtpad.filter(x => x._id.toString() === _id)[0].kolicina;
        skladiste.kolicina = skladiste.kolicina + (updatingData.kolicina - previousAmount);
        await skladiste_controller.updateMethod(updatingStorageID, skladiste);
        data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await Otpad.findByIdAndUpdate(_id, updatingData, {new: true});
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
        const deletedData = await Otpad.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}
