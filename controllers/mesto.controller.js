const Mesto = require('../models/mesto');

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
        const savedData = await Mesto.create(data);
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
        const foundData = await Mesto.find(query);
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
        const foundData = await Mesto.findById(_id);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.findOneMethod = async (value, type) => {
    let query = {};
    query[type] = value;
    try {
        const foundData = await Mesto.findOne(query);
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
        const updatedData = await Mesto.findByIdAndUpdate(_id, updatingData);
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
        const deletedData = await Mesto.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.readOpstine = async (req, res) => {
    try {
        const foundData = await Mesto.find().distinct('opstinaNaziv'); 
        res.status(200).json(foundData);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

/*
    fixedFoundData is used to make the result into a array of strings.
 */
exports.readNazivMesto = async (req, res) => {
    try {
        const foundData = await Mesto.find({'opstinaNaziv': req.params.naziv},  { '_id': 0, 'mestoNaziv' : 1});
        let fixedFoundData = [];
        foundData.forEach(x => {
            fixedFoundData.push(x.mestoNaziv);
        });
        res.status(200).json(fixedFoundData);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}
