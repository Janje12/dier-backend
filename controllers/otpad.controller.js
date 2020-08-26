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
        const skladiste = await skladiste_controller.readOneMethod(skladisteID);
        if (skladiste.neopasniOtpad.some(x => x.indeksniBroj === newData.indeksniBroj)
            || skladiste.opasniOtpad.some(x => x.indeksniBroj === newData.indeksniBroj)) {
            let updateData = skladiste.neopasniOtpad.filter(x => x.indeksniBroj === newData.indeksniBroj)[0];
            index = skladiste.neopasniOtpad.indexOf(updateData);
            updateData.kolicina = updateData.kolicina + newData.kolicina;
            console.log(updateData);
            updateData = await this.updateMethod(updateData._id, updateData);
            skladiste.neopasniOtpad[index] = updateData;
            console.log(skladiste.neopasniOtpad[index]);
        } else {
            const data = await this.createMethod(newData);
            skladiste.neopasniOtpad.push(data);
        }
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
        const updatedData = await Otpad.findByIdAndUpdate(_id, {$set:{kolicina: updatingData.kolicina}}, {new: true});
        console.log(updatedData);
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
