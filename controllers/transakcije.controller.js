const Transakcija = require('../models/transakcija');
const skladiste_controller = require('../controllers/skladiste.controller');

exports.authMethod = async (method, type, userID, companyID) => {
    switch (method) {
        case 'POST':
            if (type === '/login')
                await this.createAuthMethod(method, 'AUTH_LOGIN', userID, companyID);
            if (type === '/register')
                await this.createAuthMethod(method, 'AUTH_REGISTER',userID, companyID);
            break;
        case 'DELETE':
            await this.createAuthMethod(method, 'AUTH_LOGOUT', userID, companyID);
            break;
        default:
            break;
    }
}

exports.createAuthMethod = async (method, type, userID, companyID) => {
    const data = {
        metoda: method,
        vrstaTransakcije: type,
        korisnik: userID,
        firma: companyID,
    };
    await this.createMethod(data);
}

exports.trashMethod = async (method, userID, companyID, storageID, prevTrash, currTrash) => {
    /*console.log('TIP', method);
    console.log('PRETHODNI OTPAD', prevTrash);
    console.log('TRENUTI OTPAD', currTrash);
    console.log('KORISNIK', userID);
    console.log('SKLADISTE', storageID);*/
    //console.log('KOLICINA DODATA', currTrash.kolicina - prevTrash.kolicina);
    storage = await skladiste_controller.readOneMethod(storageID);
    switch (method) {
        case 'POST':
            await this.createTrashMethod(userID, companyID, storage, currTrash);
            break;
        case 'PATCH':
            await this.updateTrashMethod(userID, companyID, storage, prevTrash, currTrash);
            break;
        case 'DELETE':
            // brisanje
            break;
        default:
            break;
    }
}

exports.createTrashMethod = async (userID, companyID, storage, currTrash) => {
    const data = {
        metoda: 'POST',
        vrstaTransakcije: 'OTPAD',
        otpad: currTrash,
        korisnik: userID,
        firma: companyID,
        skladiste: storage,
        prethodnaKolicina: storage.kolicina - currTrash.kolicina,
        trenutnaKolicina: storage.kolicina,
        kolicinaOtpada: currTrash.kolicina,
    };
    this.createMethod(data);
}

exports.updateTrashMethod =  async (userID, companyID, storage, prevTrash, currTrash) => {
    const data = {
        metoda: 'PATCH',
        vrstaTransakcije: 'Otpad',
        otpad: currTrash,
        korisnik: userID,
        firma: companyID,
        skladiste: storage,
        prethodnaKolicina: storage.kolicina - (currTrash.kolicina - prevTrash.kolicina),
        trenutnaKolicina: storage.kolicina,
        kolicinaOtpada: (currTrash.kolicina - prevTrash.kolicina),
    };
    this.createMethod(data);
}

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
        const savedData = await Transakcija.create(data);
        return savedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}

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
    try {
        const foundData = await Transakcija.find(query);
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
        const foundData = await Transakcija.findById(_id);
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
        const updatedData = await Transakcija.findByIdAndUpdate(_id, updatingData);
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
        const deletedData = await Transakcija.findByIdAndDelete(_id);
        return deletedData;
    } catch (err) {
        console.log(err);
        return err;
    }
}
