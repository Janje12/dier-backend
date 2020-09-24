const skladiste_controller = require('../controllers/skladiste.controller');
const authLogs = require('./authLogs.middlewear');
const logsController = require('../controllers/transakcije.controller');

exports.trashMethod = async (req, method, resBody, storageID, prevTrash, currTrash, dko) => {
    const token = req.headers['authorization'].split(' ')[1];
    const data = await authLogs.extractUserInfo(token);
    const userID = data.korisnik._id;
    const companyID = data.firma._id;
    storageID = req.body.skladiste !== undefined ? req.body.skladiste : storageID;
    const storage = await skladiste_controller.readOneMethod(storageID);
    if (!currTrash)
        currTrash = resBody.otpad ? resBody.otpad : resBody;
    const prevTrashAmount = prevTrash !== undefined ? prevTrash.kolicina : 0;

    switch (method) {
        case 'POST':
            await this.createTrashMethod(method, 'TRASH_CREATE', userID, companyID, storage, prevTrashAmount, currTrash);
            break;
        case 'PATCH':
            await this.createTrashMethod(method, 'TRASH_UPDATE', userID, companyID, storage, prevTrashAmount, currTrash, dko);
            break;
        case 'DELETE':
            await this.createTrashMethod(method, 'TRASH_DELETE', userID, companyID, storage, prevTrashAmount, currTrash);
            break;
        default:
            break;
    }
};

exports.createTrashMethod = async (method, type, userID, companyID, storage, prevTrashAmount, currTrash, dko) => {
    const data = {
        metoda: method,
        vrstaTransakcije: type,
        otpad: currTrash,
        korisnik: userID,
        firma: companyID,
        skladiste: storage,
        prethodnaKolicina: storage.kolicina - (currTrash.kolicina - prevTrashAmount),
        trenutnaKolicina: storage.kolicina,
        kolicinaOtpada: currTrash.kolicina - prevTrashAmount,
        dko: dko ? dko : null,
    };
    await logsController.createMethod(data);
};