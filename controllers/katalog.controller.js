const Katalog = require('../models/katalog');

/*
    Technically none of this should ever be used except the readOne and readMany as its a static never changing table.
 */
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
        const savedData = await Katalog.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}
/*
    When calling readMany specify which type of Otpad (Opasni/Neopasni) you will need.
 */
exports.readMany = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const type = req.params.type || {};
    try {
        const data = await this.readManyMethod(type);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

exports.readManyMethod = async (type) => {
    let query = {};
    if (typeof type === "string") {
        if (type.localeCompare('neopasniOtpad')) {
            query = {'indeksniBroj': {$regex: /\*$/, $options: 'm'}};
        } else if (type.localeCompare('opasniOtpad')) {
            query = {'indeksniBroj': {$regex: /[^\*]$/, $options: 'm'}};
        }
    }
    try {
        const foundData = await Katalog.find(query);
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
        const foundData = await Katalog.findById(_id);
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
        const updatedData = await Katalog.findByIdAndUpdate(_id, updatingData);
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
        const deletedData = await Katalog.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}


exports.getNeopasniKatalog = async (req, res) => {
    katalog = await Katalog.find({'indeksniBroj': {$regex: /[^\*]$/, $options: 'm'}});
    res.status(200).json(katalog);
}

exports.getOpasaniKatalog = async (req, res) => {
    katalog = await Katalog.find({'indeksniBroj': {$regex: /\*$/, $options: 'm'}});
    res.status(200).json(katalog);
}
