const DKO = require('../models/dko');
const mongoose = require('mongoose');
const cyr_converter = require('../lib/cyr-converter');
const trashController = require('../controllers/otpad.controller');
const companyController = require('../controllers/firma.controller');
const addressController = require('../controllers/mesto.controller');
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

exports.createTransportReport = async (dko) => {
    const html = fs.readFileSync('pdf_templates/DKO.html', 'utf8');
    const today = new Date();
    const path = './tmp/DKO/' + 'DKO_' + dko.otpad._id + '_' + today.getMonth() + '.pdf';

    const vrstaProizvodjaca = new Array();
    const vrstaPrimalaca = new Array();
    const rLista = dko.nacinPostupanja.startsWith('R') ? dko.nacinPostupanja : '';
    const dLista = dko.nacinPostupanja.startsWith('D') ? dko.nacinPostupanja : '';
    vrstaProizvodjaca.push(dko.vrstaProizvodjaca === 'production' ? 'X' : '');
    vrstaProizvodjaca.push(dko.vrstaProizvodjaca === 'treatment' ? 'X' : '');
    vrstaProizvodjaca.push(dko.vrstaProizvodjaca === 'storage' ? 'X' : '');
    vrstaPrimalaca.push(dko.vrstaPrimalaca === 'storage' ? 'X' : '');
    vrstaPrimalaca.push(dko.vrstaPrimalaca === 'treatment' ? 'X' : '');
    vrstaPrimalaca.push(dko.vrstaPrimalaca === 'dump' ? 'X' : '');
    await this.createMethod(dko);
    let tmp;
    if (dko.datumIspitivanja) {
        dko.datumIspitivanja = dko.datumIspitivanja.slice(0, 10);
        dko.datumIspitivanja = dko.datumIspitivanja.replace(/-/g, '.');
        tmp = dko.datumIspitivanja.split('.');
        dko.datumIspitivanja = tmp[2] + '.' + tmp[1] + '.' + tmp[0];
    }
    if (dko.datumDozvoleProizvodjac) {
        dko.datumDozvoleProizvodjac = dko.datumDozvoleProizvodjac.slice(0, 10);
        dko.datumDozvoleProizvodjac = dko.datumDozvoleProizvodjac.replace(/-/g, '.');
        tmp = dko.datumDozvoleProizvodjac.split('.');
        dko.datumDozvoleProizvodjac = tmp[2] + '.' + tmp[1] + '.' + tmp[0];
    }
    dko.datumDozvoleTransport = dko.datumDozvoleTransport.slice(0, 10);
    dko.datumDozvoleTransport = dko.datumDozvoleTransport.replace(/-/g, '.');
    tmp = dko.datumDozvoleTransport.split('.');
    dko.datumDozvoleTransport = tmp[2] + '.' + tmp[1] + '.' + tmp[0];
    dko.datumDozvolePrimalac = dko.datumDozvolePrimalac.slice(0, 10);
    dko.datumDozvolePrimalac = dko.datumDozvolePrimalac.replace(/-/g, '.');
    tmp = dko.datumDozvolePrimalac.split('.');
    dko.datumDozvolePrimalac = tmp[2] + '.' + tmp[1] + '.' + tmp[0];
    const tmpDKO = this.convertToCyrilic(dko);

    const document = {
        html: html,
        data: {
            dko: dko,
            danas: today,
            pocetak: dko.rutaKretanja[0],
            lokacija1: dko.rutaKretanja[1],
            lokacija2: dko.rutaKretanja[2],
            lokacija3: dko.rutaKretanja[3],
            odrediste: dko.rutaKretanja[dko.rutaKretanja.length - 1],
            proizvodjac: vrstaProizvodjaca[0],
            tretman: vrstaProizvodjaca[1],
            vlasnik: vrstaProizvodjaca[2],
            rLista: rLista,
            dLista: dLista,
            skladistenjePrimalac: vrstaPrimalaca[0],
            tretmanPrimalac: vrstaPrimalaca[1],
            odlaganjePrimalac: vrstaPrimalaca[2],
        },
        path: path,
    };

    return document;
};

exports.create = async (req, res) => {
    if (!req.body) {
        res.sendStatus(401);
        return;
    }
    const dko = req.body.dko;
    try {
        const trash = await trashController.readOneMethod(dko.otpad._id);
        if (!trash)
            res.sendStatus(401);
        const companySender = await companyController.readOneMethod(dko.firmaProizvodjac._id);
        if (!companySender)
            res.sendStatus(401);
        const companyTransport = await companyController.findKomitentOneMethod(dko.firmaTransport.pib, 'pib');
        if (!companyTransport) {
            dko.firmaTransport._id = mongoose.Types.ObjectId();
            dko.firmaTransport.adresa.mesto
                = await addressController.findOneMethod(dko.firmaTransport.adresa.mesto.mestoNaziv, 'mestoNaziv');
            dko.firmaTransport = await companyController.createKomitentMethod(dko.firmaTransport);
        } else {
            dko.firmaTransport = companyTransport;
        }
        const companyReceiver = await companyController.findKomitentOneMethod(dko.firmaPrimalac.pib, 'pib');
        if (!companyReceiver) {
            dko.firmaPrimalac._id = mongoose.Types.ObjectId();
            dko.firmaPrimalac.adresa.mesto =
                await addressController.findOneMethod(dko.firmaPrimalac.adresa.mesto.mestoNaziv, 'mestoNaziv');
            dko.firmaPrimalac = await companyController.createKomitentMethod(dko.firmaPrimalac);
        } else {
            dko.firmaPrimalac = companyReceiver;
        }
        if (!trash.indeksniBroj.endsWith('*')) {
            const document = await this.createTransportReport(dko);
            await pdf.create(document, PDF_OPTIONS)
                .then(res => {
                    console.log(res);
                })
                .catch(error => {
                    console.error(error);
                });

            const today = new Date();
            res.sendFile(path.join(__dirname, '../tmp/DKO/' + 'DKO_' + dko.otpad._id + '_' + today.getMonth() + '.pdf'));
        } else {
            await this.createMethod(dko);
            res.sendStatus(200);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

exports.createMethod = async (data) => {
    // const query = {};
    try {
        const savedData = await DKO.create(data);
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
