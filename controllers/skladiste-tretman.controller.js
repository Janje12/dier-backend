const SkladisteTretman = require('../models/skladiste').SkladisteTretman;
const Firma = require('../models/firma').Firma;

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

exports.createMethod = async (data) => {
    try {
        const savedData = await SkladisteTretman.create(data);
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
        const foundData = await SkladisteTretman.find(query);
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
    _id = req.params.id;
    try {
        data = await this.readOneMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.readOneMethod = async (_id) => {
    try {
        const foundData = await SkladisteTretman.findById(_id).populate('neopasniOtpad').populate('opasniOtpad');
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
    _id = req.params.id;
    updatingData = req.body;
    try {
        data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await SkladisteTretman.findByIdAndUpdate(_id, updatingData);
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
    _id = req.params.id;
    try {
        data = await this.deleteMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.deleteMethod = async (_id) => {
    try {
        const deletedData = await SkladisteTretman.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.getSkladistaFirme = async (req, res) => {
    if (!req.params) {
        res.sendStatus(404);
        return;
    }
    const firmaID = req.params.id;
    try {
        const firma = await Firma.findById(firmaID).populate('skladistaTretman');
        const skladistaTretman = firma.skladistaTretman;
        for (let i = 0; i < skladistaTretman.length; i++) {
            skladistaTretman[i] = await this.readOneMethod(skladistaTretman[i]._id);
        }
        res.status(200).json(skladistaTretman);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};
