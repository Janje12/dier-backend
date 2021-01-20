const YearlyReport = require('../models/yearlyReport.model');
const monthlyReportController = require('./monthlyReport.controller');
const storageController = require('./storage.controller');
const companyController = require('./company.controller');
const cyr_converter = require('../lib/cyr-converter');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const PDF_OPTIONS = require('../pdf_templates/pdf_options').PDF_OPTIONS;

exports.convertToCyrilic = (obj) => {
    let result = obj;
    for (let key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'string' && key !== '_id' && key !== 'email' && key !== 'emailPrijem' && key !== 'nacinPostupanja'
                && key !== 'qLista') {
                result[key] = cyr_converter(obj[key]);
            } else if (typeof obj[key] === 'object' && key !== 'isNew' && key !== 'errors' &&
                key !== '$locals' && key !== '$op' && key !== '$init' && key !== '$__') {
                result[key] = this.convertToCyrilic(obj[key]);
            }
        }
    }
    return result;
};

exports.createYearlyProductionReport = async (trash, company) => {
    const html = fs.readFileSync('pdf_templates/GIO1.html', 'utf8');
    const today = new Date();
    const path = './tmp/GIO1/' + trash._id + '_' + today.getFullYear() + '.pdf';
    let query = {};
    query['otpad'] = trash._id;
    const monthlyReports = await monthlyReportController.readManyMethod(query);
    let totalProduction = 0; let currentAmmount = 0;
    monthlyReports.forEach(mr => {
        totalProduction += mr.ukupnoProizvodnja;
    });
    currentAmmount = monthlyReports[monthlyReports.length - 1].ukupnoStanje;
    const trashType = trash.indeksniBroj.endsWith('*') ? 'опасни' : 'неопасни';
    const storage = await storageController.readOneMethod(monthlyReports[0].skladiste._id);
    const qLista = [(trash.qLista / 10).toFixed(0), trash.qLista % 10];
    const indeksniBroj = trash.indeksniBroj.replace(/\s/g,'').split('');
    const opasan = trash.indeksniBroj.endsWith('*') ? 'X' : '';
    const neopasan = trash.indeksniBroj.endsWith('*') ? '' : 'X';
    const tmpCompany = this.convertToCyrilic(company);
    const tmpTrash = this.convertToCyrilic(trash);
    const tmpStorage = this.convertToCyrilic(storage);
    const document = {
        html: html,
        data: {
            vrsta: 'GIO1',
            godina: today.getFullYear() % 2020,
            firma: company,
            skladiste: tmpStorage,
            vrstaOtpada: trashType,
            indeksniBroj: indeksniBroj,
            qLista: qLista,
            otpad: tmpTrash,
            neopasan: neopasan,
            opasan: opasan,
            mesecniIzvestaj: monthlyReports,
            ukupnoProizvodnja: totalProduction,
            ukupnoStanje: currentAmmount,
        },
        path: path,
    };
    const newData = {
        vrsta: 'GIO1',
        godina: today.getFullYear(),
        firma: company,
        skladiste: monthlyReports[0].skladiste,
        otpad: trash,
        mesecniIzvestaj: monthlyReports,
        ukupnoProizvodnja: totalProduction,
        ukupnoStanje: currentAmmount,
    };
    await this.createMethod(newData);
    return document;
};

exports.prepareYearlyReportMethod = async (trash, reportType, company) => {
    let document;
    switch (reportType) {
        case 'PRODUCTION':
            document = await this.createYearlyProductionReport(trash, company);
            break;
        /* case 'TREATMENT':
             document = await this.createTreatmentReport(trash);
             break;
         case 'DUMP':
             document = await this.createDumpReport(trash);
             break;*/
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
    const company = req.body.company;
    try {
        const document = await this.prepareYearlyReportMethod(trash, reportType, company);
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
            documentName = 'GIO1';
        if (reportType === 'TREATMENT')
            documentName = 'GIO2';
        if (reportType === 'DUMP')
            documentName = 'GIO3';
        // POPRAVI OVO ^
        res.sendFile(path.join(__dirname, '../tmp/' + documentName + '/' + trash._id + '_' + today.getFullYear() + '.pdf'));
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.createMethod = async (data) => {
    let query = {};
    const today = new Date();
    query['otpad'] = data.otpad._id;
    query['godina'] = today.getFullYear();
    try {
        const foundData = await this.findOneMethod(query);
        let savedData;
        if (!foundData)
            savedData = await YearlyReport.create(data);
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
        const foundData = await YearlyReport.find(query);
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
        const foundData = await YearlyReport.findById(_id);
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


exports.findOneMethod = async (query) => {
    try {
        const foundData = await YearlyReport.findOne(query);
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
        const foundData = await YearlyReport.find(query);
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
        const updatedData = await YearlyReport.findByIdAndUpdate(_id, updatingData, {returnOriginal: false});
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
        const deletedData = await YearlyReport.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
};
