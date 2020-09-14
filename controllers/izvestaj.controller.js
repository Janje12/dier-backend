const Izvestaj = require('../models/mesecniIzvestaj');
const transkacije_controller = require('../controllers/transakcije.controller');
const pdf = require("pdf-creator-node");
const fs = require('fs');
const path = require('path');
const PDF_OPTIONS = require('../pdf_templates/pdf_options').PDF_OPTIONS;

exports.createProductionReport = async (trash, storageID) => {
    const html = fs.readFileSync('pdf_templates/DEO1.html', 'utf8');
    const today = new Date();
    const path = './tmp/DEO1/' + trash._id + '_' + today.getMonth() + '.pdf';
    let query = {};
    query['datum'] =
        {
            "$gte": new Date(today.getFullYear(), today.getMonth() - 1, 1),
            "$lt": new Date(today.getFullYear(), today.getMonth(), 31)
        }
    query['otpad'] = trash._id;
    query['kolicinaOtpada'] = {$gt: 0};
    const akcijaProizvodnje = await transkacije_controller.readManyMethod(query);
    // console.log(akcijaProizvodnje);
    let ukupnoProizvodnja = 0, ukupnoStanje = 0;
    akcijaProizvodnje.forEach(x => {
        ukupnoProizvodnja += x.kolicinaOtpada;
        ukupnoStanje += x.trenutnaKolicina;
        x.datumm = x.datum.getDay() + '.' + x.datum.getMonth();

    })
    const count = []
    for (let i = 0; i < 31 - akcijaProizvodnje.length; i++) {
        count.push(i);
    }
    const document = {
        html: html,
        data: {
            godina: today.getFullYear(),
            mesec: today.getMonth(),
            otpad: trash,
            akcijaProizvodnje: akcijaProizvodnje,
            akcijaTransporta: 0,
            ukupnoProizvodnja: ukupnoProizvodnja,
            ukupnoTransport: 0,
            ukupnoStanje: ukupnoStanje,
            count: count
        },
        path: path,
    };
    const newData = {
        godina: today.getFullYear(),
        mesec: today.getMonth(),
        otpad: trash,
        skladiste: storageID,
        akcijaProizvodnja: akcijaProizvodnje,
        akcijaTransport: [],
        ukupnoProizvodnja: ukupnoProizvodnja,
        ukupnoTransport: 0,
        ukupnoStanje: ukupnoStanje,
    }
    //await this.createMethod(newData);
    return document;
}

exports.prepareReportMethod = async (trash, reportType, storageID) => {
    let document;
    switch (reportType) {
        case 'PRODUCTION':
            document = await this.createProductionReport(trash, storageID);
    }
    return document;
}

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(401);
        return;
    }
    const trash = req.body.trash;
    const reportType = req.body.reportType;
    const storageID = req.body.storageID;
    try {
        const document = await this.prepareReportMethod(trash, reportType, storageID);
        // console.log(document);
        await pdf.create(document, PDF_OPTIONS)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            });
        const today = new Date();
        res.sendFile(path.join(__dirname, '../tmp/DEO1/' + trash._id + '_' + today.getMonth() + '.pdf'));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

exports.createMethod = async (data) => {
    try {
        const savedData = await Izvestaj.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.readMany = async (req, res) => {
    // WIP
    let query = {};
    try {
        const data = await this.readManyMethod(query);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.readManyMethod = async (query) => {
    try {
        const foundData = await Izvestaj.find(query);
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
    const _id = req.params.id;
    try {
        const data = await this.readOneMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.readOneMethod = async (_id) => {
    try {
        const foundData = await Izvestaj.findById(_id);
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
        const foundData = await Izvestaj.findOne(query);
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
    const _id = req.params.id;
    const updatingData = req.body;
    try {
        const data = await this.updateMethod(_id, updatingData);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.updateMethod = async (_id, updatingData) => {
    try {
        const updatedData = await Izvestaj.findByIdAndUpdate(_id, updatingData);
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
    const _id = req.params.id;
    try {
        const data = await this.deleteMethod(_id);
        res.status(200).json(data);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.deleteMethod = async (_id) => {
    try {
        const deletedData = await Izvestaj.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}
