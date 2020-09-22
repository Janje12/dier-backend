const MesecniIzvestaj = require('../models/mesecniIzvestaj');
const logsController = require('../controllers/transakcije.controller');
const dayLogsController = require('../controllers/dnevniIzvestaj.controller');
const pdf = require('pdf-creator-node');
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
            '$gte': new Date(today.getFullYear(), today.getMonth(), 1),
            '$lt': new Date(today.getFullYear(), today.getMonth(), 31)
        };
    query['otpad'] = trash._id;
    query['kolicinaOtpada'] = {$gt: 0};
    const akcijaProizvodnje = await logsController.readManyMethod(query);
    let ukupnoProizvodnja = 0, ukupnoStanje = 0;
    let dnevniIzvestaj = new Array(31);

    akcijaProizvodnje.forEach(x => {
        let i = x.datum.getDate();
        if (!dnevniIzvestaj[i]) {
            dnevniIzvestaj[i] = {};
            dnevniIzvestaj[i].otpad = x.otpad;
            dnevniIzvestaj[i].godina = x.datum.getFullYear();
            dnevniIzvestaj[i].mesec = x.datum.getMonth() + 1; // Month starts at 0 >.<
            dnevniIzvestaj[i].dan = x.datum.getDate();
            dnevniIzvestaj[i].skladiste = x.skladiste;
            dnevniIzvestaj[i].akcijaProizvodnja = [];
            dnevniIzvestaj[i].akcijaProizvodnja.push(x);
            dnevniIzvestaj[i].ukupnoProizvodnja = x.kolicinaOtpada;
            dnevniIzvestaj[i].ukupnoTransport = 0;
            dnevniIzvestaj[i].ukupnoStanje = x.kolicinaOtpada;
        } else {
            dnevniIzvestaj[i].akcijaProizvodnja.push(x);
            dnevniIzvestaj[i].ukupnoProizvodnja += x.kolicinaOtpada;
            dnevniIzvestaj[i].ukupnoStanje += x.kolicinaOtpada;
        }
        ukupnoProizvodnja += x.kolicinaOtpada;
    });
    const count = [];
    for (let i = 0; i < 31; i++) {
        if (!dnevniIzvestaj[i])
            count.push(i);
    }
    const tmp = []
    let lastAmmount = 0;
    for (let i = 0; i < dnevniIzvestaj.length; i++) {
        if (dnevniIzvestaj[i]) {
            ukupnoStanje += dnevniIzvestaj[i].ukupnoStanje;
            dnevniIzvestaj[i].ukupnoStanje += lastAmmount;
            tmp.push(await dayLogsController.createMethod(dnevniIzvestaj[i]));
            lastAmmount = dnevniIzvestaj[i].ukupnoStanje;
        }
    }
    dnevniIzvestaj = tmp;

    const document = {
        html: html,
        data: {
            godina: today.getFullYear(),
            mesec: today.getMonth() + 1,
            otpad: trash,
            dnevniIzvestaj: dnevniIzvestaj,
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
        dnevniIzvestaj: dnevniIzvestaj,
        ukupnoProizvodnja: ukupnoProizvodnja,
        ukupnoTransport: 0,
        ukupnoStanje: ukupnoStanje,
    };
    await this.createMethod(newData);
    return document;
};

exports.prepareReportMethod = async (trash, reportType, storageID) => {
    let document;
    switch (reportType) {
        case 'PRODUCTION':
            document = await this.createProductionReport(trash, storageID);
    }
    return document;
};

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
                console.log(res);
            })
            .catch(error => {
                console.error(error);
            });
        const today = new Date();
        res.sendFile(path.join(__dirname, '../tmp/DEO1/' + trash._id + '_' + today.getMonth() + '.pdf'));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.createMethod = async (data) => {
    let query = {};
    const today = new Date();
    query['otpad'] = data.otpad._id;
    query['mesec'] = today.getMonth();
    try {
        const foundData = await this.findOneMethod(query);
        let savedData;
        if (!foundData)
            savedData = await MesecniIzvestaj.create(data);
        else
            savedData = this.updateMethod(foundData._id, data);
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
        const foundData = await MesecniIzvestaj.find(query);
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
        const foundData = await MesecniIzvestaj.findById(_id);
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.findOneMethod = async (query) => {
    try {
        const foundData = await MesecniIzvestaj.findOne(query);
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
        const updatedData = await MesecniIzvestaj.findByIdAndUpdate(_id, updatingData, {returnOriginal: false});
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
        const deletedData = await MesecniIzvestaj.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};
