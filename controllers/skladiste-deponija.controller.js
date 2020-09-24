const SkladisteDeponijaController = require('../models/skladiste').SkladisteDeponija;
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
        const savedData = await SkladisteDeponijaController.create(data);
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
        const foundData = await SkladisteDeponijaController.find(query);
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
        const foundData = await SkladisteDeponijaController.findById(_id).populate('neopasniOtpad').populate('opasniOtpad');
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
        const updatedData = await SkladisteDeponijaController.findByIdAndUpdate(_id, updatingData);
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
        const deletedData = await SkladisteDeponijaController.findByIdAndDelete(_id);
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
        const firma = await Firma.findById(firmaID).populate('skladistaDeponija');
        const skladistaDeponija = firma.skladistaDeponija;
        for (let i = 0; i < skladistaDeponija.length; i++) {
            skladistaDeponija[i] = await this.readOneMethod(skladistaDeponija[i]._id);
        }
        res.status(200).json(skladistaDeponija);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

};
