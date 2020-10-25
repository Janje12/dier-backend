const MesecniIzvestaj = require('../models/mesecniIzvestaj');
const logsController = require('../controllers/transakcije.controller');
const dayLogsController = require('../controllers/dnevniIzvestaj.controller');
const storageController = require('../controllers/skladiste.controller');
const companyController = require('../controllers/firma.controller');
const Firma = require('../models/firma').FirmaKomitent;
const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const PDF_OPTIONS = require('../pdf_templates/pdf_options').PDF_OPTIONS;

exports.fillDailyReport = async (productions, transports) => {
    const dailyReport = new Array(31);
    productions.forEach(dp => {
        const i = dp.datum.getDate();
        if (!dailyReport[i]) {
            dailyReport[i] = {};
            dailyReport[i].godina = dp.datum.getFullYear();
            dailyReport[i].mesec = dp.datum.getMonth();
            dailyReport[i].dan = dp.datum.getDate();
            dailyReport[i].otpad = dp.otpad;
            dailyReport[i].skladiste = dp.skladiste;
            dailyReport[i].akcijaProizvodnja = [];
            dailyReport[i].akcijaProizvodnja.push(dp);
            dailyReport[i].akcijaTransport = [];
            dailyReport[i].ukupnoStanje = 0;
            dailyReport[i].ukupnoProizvodnja = 0;
            dailyReport[i].ukupnoTransport = 0;
            if (dp.nacinPostupanja && dp.nacinPostupanja.startsWith('R'))
                dailyReport[i].rLista = dp.nacinPostupanja;
            if (dp.nacinPostupanja && dp.nacinPostupanja.startsWith('D'))
                dailyReport[i].dLista = dp.nacinPostupanja;
            dailyReport[i].ukupnoStanje = dp.kolicinaOtpada;
            dailyReport[i].ukupnoProizvodnja = dp.kolicinaOtpada;
        } else {
            dailyReport[i].akcijaProizvodnja.push(dp);
            dailyReport[i].ukupnoProizvodnja += dp.kolicinaOtpada;
            dailyReport[i].ukupnoStanje += dp.kolicinaOtpada;
        }
    });
    transports.forEach(dt => {
        const i = dt.datum.getDate();
        if (!dailyReport[i]) {
            dailyReport[i] = {};
            dailyReport[i].godina = dt.datum.getFullYear();
            dailyReport[i].mesec = dt.datum.getMonth();
            dailyReport[i].dan = dt.datum.getDate();
            dailyReport[i].otpad = dt.otpad;
            dailyReport[i].skladiste = dt.skladiste;
            dailyReport[i].akcijaProizvodnja = [];
            dailyReport[i].akcijaTransport = [];
            dailyReport[i].akcijaTransport.push(dt);
            if (dt.nacinPostupanja && dt.nacinPostupanja.startsWith('R'))
                dailyReport[i].rLista = dt.nacinPostupanja;
            if (dt.nacinPostupanja && dt.nacinPostupanja.startsWith('D'))
                dailyReport[i].dLista = dt.nacinPostupanja;
            dailyReport[i].ukupnoStanje = 0;
            dailyReport[i].ukupnoProizvodnja = 0;
            dailyReport[i].ukupnoTransport = 0;
            if (dt.nacinPostupanja.startsWith('R')) {
                dailyReport[i].ukupnoStanje = dt.kolicinaOtpada;
                if (dt.vrstaTransakcije !== 'TRASH_CREATE')
                    dailyReport[i].ukupnoTransport = dt.kolicinaOtpada;
            } else {
                dailyReport[i].ukupnoStanje = dt.kolicinaOtpada;
                dailyReport[i].ukupnoTransport = dt.kolicinaOtpada;
            }
        } else {
            dailyReport[i].akcijaTransport.push(dt);
            dailyReport[i].ukupnoStanje += dt.kolicinaOtpada;
            if (dt.vrstaTransakcije !== 'TRASH_CREATE')
                dailyReport[i].ukupnoTransport += dt.kolicinaOtpada;

        }
        if (dt.dko) {
            dailyReport[i].dko = dt.dko;
            dailyReport[i].rLista = dt.dko.nacinPostupanja.startsWith('R') ? dt.dko.nacinPostupanja : '';
            dailyReport[i].dLista = dt.dko.nacinPostupanja.startsWith('D') ? dt.dko.nacinPostupanja : '';
            dailyReport[i].sakupljac = dt.dko.vrstaPrimalaca === 'storage' ? 'X' : '';
            dailyReport[i].tretman = dt.dko.vrstaPrimalaca === 'treatment' ? 'X' : '';
            dailyReport[i].odlagac = dt.dko.vrstaPrimalaca === 'dump' ? 'X' : '';
            dailyReport[i].brojDozvole = dt.dko.sifraDozvolePrimalac;
            dailyReport[i].nazivFirme = dt.dko.firmaPrimalac.naziv;
        } else {
            dailyReport[i].nazivFirme = dt.nazivFirme;
            dailyReport[i].brojDozvole = dt.brojDKO;
            if (dt.nacinPostupanja && dt.nacinPostupanja.startsWith('R'))
                dailyReport[i].rLista = dt.nacinPostupanja;
            if (dt.nacinPostupanja && dt.nacinPostupanja.startsWith('D'))
                dailyReport[i].dLista = dt.nacinPostupanja;
        }
    });
    return dailyReport;
};

exports.createDumpReport = async (trash, storageID) => {
    const html = fs.readFileSync('pdf_templates/DEO3.html', 'utf8');
    const today = new Date();
    const path = './tmp/DEO3/' + trash._id + '_' + today.getMonth() + '.pdf';
    let query = {};
    query['datum'] =
        {
            '$gte': new Date(today.getFullYear(), today.getMonth(), 1),
            '$lt': new Date(today.getFullYear(), today.getMonth(), 31)
        };
    query['otpad'] = trash._id;
    query['kolicinaOtpada'] = {$lt: 0};
    const akcijaOdlaganja = await logsController.readManyMethod(query);
    query['kolicinaOtpada'] = {$gt: 0};
    const akcijaTransporta = await logsController.readManyMethod(query);

    let ukupnoProizvodnja = 0, ukupnoStanje = 0, ukupnoTransport = 0;
    let dnevniIzvestaj = await this.fillDailyReport(akcijaOdlaganja, akcijaTransporta);

    const tmp = [];
    let lastAmmount = 0;
    const storage = await storageController.readOneMethod(storageID);
    for (let i = 0; i < dnevniIzvestaj.length; i++) {
        if (dnevniIzvestaj[i]) {
            ukupnoProizvodnja -= dnevniIzvestaj[i].ukupnoProizvodnja;
            dnevniIzvestaj[i].ukupnoProizvodnja *= -1;
            ukupnoTransport += dnevniIzvestaj[i].ukupnoTransport;
            ukupnoStanje += dnevniIzvestaj[i].ukupnoStanje;
            dnevniIzvestaj[i].ukupnoStanje += lastAmmount;
            dnevniIzvestaj[i].klasaDeponije = storage.vrstaDeponije;
            if (dnevniIzvestaj[i].dko) {
                dnevniIzvestaj[i].nazivFirme = (await Firma.findById(dnevniIzvestaj[i].dko.firmaPrimalac)).naziv;
            }
            tmp.push(await dayLogsController.createMethod(dnevniIzvestaj[i]));
            lastAmmount = dnevniIzvestaj[i].ukupnoStanje;
        }
    }

    dnevniIzvestaj = tmp;
    const count = [];
    for (let i = 0; i < 31; i++) {
        if (!dnevniIzvestaj[i])
            count.push(i);
    }
    console.log(dnevniIzvestaj);
    const document = {
        html: html,
        data: {
            godina: today.getFullYear(),
            mesec: today.getMonth() + 1,
            otpad: trash,
            dnevniIzvestaj: dnevniIzvestaj,
            ukupnoProizvodnja: ukupnoProizvodnja,
            ukupnoTransport: ukupnoTransport,
            ukupnoStanje: ukupnoStanje,
            count: count,
        },
        path: path,
    };
    const newData = {
        vrsta: 'DEO3',
        godina: today.getFullYear(),
        mesec: today.getMonth(),
        otpad: trash,
        skladiste: storageID,
        dnevniIzvestaj: dnevniIzvestaj,
        ukupnoProizvodnja: ukupnoProizvodnja,
        ukupnoTransport: ukupnoTransport,
        ukupnoStanje: ukupnoStanje,
    };
    await this.createMethod(newData);
    return document;
};

exports.createTreatmentReport = async (trash, storageID) => {
    const html = fs.readFileSync('pdf_templates/DEO2.html', 'utf8');
    const today = new Date();
    const path = './tmp/DEO2/' + trash._id + '_' + today.getMonth() + '.pdf';
    let query = {};
    query['datum'] =
        {
            '$gte': new Date(today.getFullYear(), today.getMonth(), 1),
            '$lt': new Date(today.getFullYear(), today.getMonth(), 31)
        };
    query['otpad'] = trash._id;
    query['kolicinaOtpada'] = {$lt: 0};
    const akcijaTretmana = await logsController.readManyMethod(query);
    query['kolicinaOtpada'] = {$gt: 0};
    const akcijaTransporta = await logsController.readManyMethod(query);

    let ukupnoProizvodnja = 0, ukupnoStanje = 0, ukupnoTransport = 0;

    let dnevniIzvestaj = await this.fillDailyReport(akcijaTretmana, akcijaTransporta);

    const tmp = [];
    let lastAmmount = 0;
    for (let i = 0; i < dnevniIzvestaj.length; i++) {
        if (dnevniIzvestaj[i]) {
            ukupnoProizvodnja -= dnevniIzvestaj[i].ukupnoProizvodnja;
            dnevniIzvestaj[i].ukupnoProizvodnja *= -1;
            ukupnoTransport += dnevniIzvestaj[i].ukupnoTransport;
            ukupnoStanje += dnevniIzvestaj[i].ukupnoStanje;
            dnevniIzvestaj[i].ukupnoStanje += lastAmmount;
            if (dnevniIzvestaj[i].dko) {
                dnevniIzvestaj[i].nazivFirme = (await Firma.findById(dnevniIzvestaj[i].dko.firmaPrimalac)).naziv;
            }
            tmp.push(await dayLogsController.createMethod(dnevniIzvestaj[i]));
            lastAmmount = dnevniIzvestaj[i].ukupnoStanje;
        }
    }
    dnevniIzvestaj = tmp;
    const count = [];
    for (let i = 0; i < 31; i++) {
        if (!dnevniIzvestaj[i])
            count.push(i);
    }
    const document = {
        html: html,
        data: {
            godina: today.getFullYear(),
            mesec: today.getMonth() + 1,
            otpad: trash,
            dnevniIzvestaj: dnevniIzvestaj,
            ukupnoProizvodnja: ukupnoProizvodnja,
            ukupnoTransport: ukupnoTransport,
            ukupnoStanje: ukupnoStanje,
            count: count,
        },
        path: path,
    };
    const newData = {
        vrsta: 'DEO2',
        godina: today.getFullYear(),
        mesec: today.getMonth(),
        otpad: trash,
        skladiste: storageID,
        dnevniIzvestaj: dnevniIzvestaj,
        ukupnoProizvodnja: ukupnoProizvodnja,
        ukupnoTransport: ukupnoTransport,
        ukupnoStanje: ukupnoStanje,
    };
    await this.createMethod(newData);
    return document;
};

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
    query['kolicinaOtpada'] = {$lt: 0};
    const akcijaTransporta = await logsController.readManyMethod(query);

    let ukupnoProizvodnja = 0, ukupnoStanje = 0, ukupnoTransport = 0;

    let dnevniIzvestaj = await this.fillDailyReport(akcijaProizvodnje, akcijaTransporta);

    const tmp = [];
    let lastAmmount = 0;
    for (let i = 0; i < dnevniIzvestaj.length; i++) {
        if (dnevniIzvestaj[i]) {
            ukupnoProizvodnja += dnevniIzvestaj[i].ukupnoProizvodnja;
            ukupnoTransport += dnevniIzvestaj[i].ukupnoTransport;
            ukupnoStanje += dnevniIzvestaj[i].ukupnoStanje;
            dnevniIzvestaj[i].ukupnoStanje += lastAmmount;
            if (dnevniIzvestaj[i].dko) {
                dnevniIzvestaj[i].nazivFirme = (await Firma.findById(dnevniIzvestaj[i].dko.firmaPrimalac)).naziv;
            }
            tmp.push(await dayLogsController.createMethod(dnevniIzvestaj[i]));
            lastAmmount = dnevniIzvestaj[i].ukupnoStanje;
        }
    }
    dnevniIzvestaj = tmp;
    const count = [];
    for (let i = 0; i < 31; i++) {
        if (!dnevniIzvestaj[i])
            count.push(i);
    }

    const document = {
        html: html,
        data: {
            godina: today.getFullYear(),
            mesec: today.getMonth() + 1,
            otpad: trash,
            dnevniIzvestaj: dnevniIzvestaj,
            ukupnoProizvodnja: ukupnoProizvodnja,
            ukupnoTransport: ukupnoTransport,
            ukupnoStanje: ukupnoStanje,
            count: count,
        },
        path: path,
    };
    const newData = {
        vrsta: 'DEO1',
        godina: today.getFullYear(),
        mesec: today.getMonth(),
        otpad: trash,
        skladiste: storageID,
        dnevniIzvestaj: dnevniIzvestaj,
        ukupnoProizvodnja: ukupnoProizvodnja,
        ukupnoTransport: ukupnoTransport,
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
            break;
        case 'TREATMENT':
            document = await this.createTreatmentReport(trash, storageID);
            break;
        case 'DUMP':
            document = await this.createDumpReport(trash, storageID);
            break;
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
        let documentName = '';
        if (reportType === 'PRODUCTION')
            documentName = 'DEO1';
        if (reportType === 'TREATMENT')
            documentName = 'DEO2';
        if (reportType === 'DUMP')
            documentName = 'DEO3';
        // POPRAVI OVO ^
        res.sendFile(path.join(__dirname, '../tmp/' + documentName + '/' + trash._id + '_' + today.getMonth() + '.pdf'));
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
        const foundData = await MesecniIzvestaj.findById(_id).populate('otpad').populate('skladiste').populate('dnevniIzvestaj');
        return foundData;
    } catch (err) {
        console.log(err);
        return err;
    }
};

exports.findOneMethod = async (query) => {
    try {
        const foundData = await MesecniIzvestaj.findOne(query).populate('dnevniIzvestaj').populate('otpad');
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

exports.findByFirma = async (req, res) => {
    if (!req.params) {
        res.sendStatus(400);
        return;
    }
    const companyPIB = req.params.pib;
    try {
        const company = await companyController.findOneMethod(companyPIB, 'pib');
        let result = [];
        let query = {};
        if (company.skladista) {
            for (let i = 0; i < company.skladista.length; i++) {
                query['skladiste'] = company.skladista[i];
                result.push(await this.findOneMethod(query));
            }
        }
        if (company.skladistaTretman) {
            for (let i = 0; i < company.skladistaTretman.length; i++) {
                query['skladiste'] = company.skladistaTretman[i];
                result.push(await this.findOneMethod(query));
            }
        }
        if (company.skladistaSkladistenje) {
            for (let i = 0; i < company.skladistaSkladistenje.length; i++) {
                query['skladiste'] = company.skladistaSkladistenje[i];
                result.push(await this.findOneMethod(query));
            }
        }
        if (company.skladistaDeponija) {
            for (let i = 0; i < company.skladistaDeponija.length; i++) {
                query['skladiste'] = company.skladistaDeponija[i];
                result.push(await this.findOneMethod(query));
            }
        }
        //console.log(result);
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};
