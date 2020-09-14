const Firma = require('../models/firma');

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
}

exports.createMethod = async (data) => {
    try {
        const savedData = await Firma.create(data);
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
        const foundData = await Firma.find(query);
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

/*
    Find a more elegant way of chosing which things to populate and which not to.
 */
exports.readOneMethod = async (_id) => {
    try {
        const foundData = await Firma.findById(_id).populate('dozvola').populate('adresa.mesto').populate('delatnost');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.findOne = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const value = req.params.value;
    try {
        const data = await this.findOneMethod(value, type);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}


exports.findOneMethod = async (value, type) => {
    let query = {};
    query[type] = value;
    try {
        const foundData = await Firma.findOne(query).populate('adresa.mesto').populate('delatnost');
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
        const updatedData = await Firma.findByIdAndUpdate(_id, updatingData);
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
        const deletedData = await Firma.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}
