const Skladiste = require('../models/skladiste').Skladiste;
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
        const savedData = await Skladiste.create(data);
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
        const foundData = await Skladiste.find(query);
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
        const foundData = await Skladiste.findById(_id).populate('neopasniOtpad').populate('opasniOtpad').populate('adresa.mesto');
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
        const foundData = await Skladiste.findOne(query).populate('adresa.mesto')
            .populate('neopasniOtpad').populate('opasniOtpad');
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
        data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await Skladiste.findByIdAndUpdate(_id, updatingData);
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
        const deletedData = await Skladiste.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.getAllSkladistaFirme = async (req, res) => {
    if (!req.params) {
        res.sendStatus(404);
        return;
    }
    const companyID = req.params.id;
    try {
        const storages = await this.findCompaniesStorage(companyID);
        res.status(200).json(storages);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.findCompaniesStorage = async (id) => {
    try {
        const firma = await Firma.findById(id).populate('skladista').populate('skladistaTretman').populate('skladistaDeponija')
            .populate('skladistaSkladistenje');
        let skladista = [];
        if (firma.skladista.length > 0)
            skladista = skladista.concat(firma.skladista);
        if (firma.skladistaSkladistenje.length > 0)
            skladista = skladista.concat(firma.skladistaSkladistenje);
        if (firma.skladistaDeponija.length > 0)
            skladista = skladista.concat(firma.skladistaDeponija);
        if (firma.skladistaTretman.length > 0)
            skladista = skladista.concat(firma.skladistaTretman);
        for (let i = 0; i < skladista.length; i++) {
            skladista[i] = await this.readOneMethod(skladista[i]._id);
        }
        return skladista;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

exports.getSkladistaFirme = async (req, res) => {
    if (!req.params) {
        res.sendStatus(404);
        return;
    }
    const firmaID = req.params.id;
    try {
        const firma = await Firma.findById(firmaID).populate('skladista');
        const skladista = firma.skladista;
        for (let i = 0; i < skladista.length; i++) {
            skladista[i] = await this.readOneMethod(skladista[i]._id);
        }
        res.status(200).json(skladista);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.getSkladistaSkladistenjeFirme = async (req, res) => {
    if (!req.params) {
        res.sendStatus(404);
        return;
    }
    const firmaID = req.params.id;
    try {
        const firma = await Firma.findById(firmaID).populate('skladistaSkladistenje');
        let skladistaSkladistenje = firma.skladistaSkladistenje;
        skladistaSkladistenje = skladistaSkladistenje.filter(x => x.skladistenje);
        for (let i = 0; i < skladistaSkladistenje.length; i++) {
            skladistaSkladistenje[i] = await this.readOneMethod(skladistaSkladistenje[i]._id);
        }
        console.log(skladistaSkladistenje);
        res.status(200).json(skladistaSkladistenje);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
