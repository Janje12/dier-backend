const DKO = require('../models/dko');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const PDF_OPTIONS = require('../pdf_templates/pdf_options').PDF_OPTIONS;

exports.createTransportReport = async (dko) => {
    const html = fs.readFileSync('pdf_templates/DKO.html', 'utf8');
    const today = new Date();
    const path = './tmp/DKO/' + 'DKO_' + dko.otpad._id + '_' + today.getMonth() + '.pdf';
    let vrstaProizvodjaca;
    let RiliD;
    let vrstaPrimalaca;

    const document = {
        html: html,
        data: {
            dko: dko,
            danas: today,
            pocetak: dko.rutaKretanja[0],
            lokacija1: dko.rutaKretanja[1],
            lokacija2: dko.rutaKretanja[2],
            lokacija3: dko.rutaKretanja[3],
            odrediste: dko.rutaKretanja[4],
        },
        path: path,
    };
    const newData = {};
    //await this.createMethod(newData);
    return document;
};

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(401);
        return;
    }
    const dko = req.body.dko;
    try {
        const document = await this.createTransportReport(dko);
        // console.log(document);
        await pdf.create(document, PDF_OPTIONS)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.error(error);
            });
        const today = new Date();
        res.sendFile(path.join(__dirname, '../tmp/DEO1/' + 'DKO' + dko.otpad._id + '_' + today.getMonth() + '.pdf'));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.createMethod = async (data) => {
    let query = {};
    try {
        savedData = await DKO.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.readMany = async (req, res) => {
    // WIP
    let query = {};
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
};

exports.readManyMethod = async (query) => {
    try {
        const foundData = await DKO.find(query);
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
        const foundData = await DKO.findById(_id);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.findOneMethod = async (query) => {
    try {
        const foundData = await DKO.findOne(query);
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
        const updatedData = await DKO.findByIdAndUpdate(_id, updatingData, {returnOriginal: false});
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
        const deletedData = await DKO.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};
