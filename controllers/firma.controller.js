const Firma = require('../models/firma').Firma;
const FirmaKomitent = require('../models/firma').FirmaKomitent;

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

exports.createKomitentMethod = async (data) => {
    try {
        const savedData = await FirmaKomitent.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.createMethod = async (data) => {
    try {
        const savedData = await Firma.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.readMany = async (req, res) => {
    // WIP
    query = req.params.query ? req.params.query : {};
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.readManyMethod = async (query) => {
    try {
        const foundData = await Firma.find(query);
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
};

exports.readOneKomitentMethod = async (_id) => {
    try {
        const foundData = await FirmaKomitent.findById(_id);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

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
};


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
};

exports.findKomitentOneMethod = async (value, type) => {
    let query = {};
    query[type] = value;
    try {
        const foundData = await FirmaKomitent.findOne(query).populate('adresa.mesto');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};


exports.findMany = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type;
    const value = req.params.value;
    try {
        const data = await this.findManyMethod(value, type);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.findManyMethod = async (value, type) => {
    let query = {};
    query[type] = value;
    try {
        const foundData = await FirmaKomitent.find(query).populate('adresa.mesto').populate('delatnost');
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
    const updatingData = req.body;
    try {
        const data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await Firma.findByIdAndUpdate(_id, updatingData);
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
        const deletedData = await Firma.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};
