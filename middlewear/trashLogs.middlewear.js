const storageController = require('../controllers/storage.controller');
const authLogs = require('./authLogs.middlewear');
const logsController = require('../controllers/transaction.controller');

exports.trashMethod = async (req, method, resBody, storageID, prevTrash, currTrash, wmd) => {
    const token = req.headers['authorization'].split(' ')[1];
    const data = await authLogs.extractUserInfo(token);
    const userID = data.user._id;
    const companyID = data.company._id;
    storageID = req.body.storageID !== undefined ? req.body.storageID : storageID;
    const storage = await storageController.readOneMethod({'_id': storageID});
    if (!currTrash)
        currTrash = resBody.trash ? resBody.trash : resBody;
    let prevTrashAmount = 0;
    if (prevTrash)
        prevTrashAmount = prevTrash.amount !== undefined ? prevTrash.amount : 0;
    const companyName = req.body.companyName;
    const documentNo = req.body.documentNo;
    switch (method) {
        case 'POST':
            await this.createTrashMethod(method, 'TRASH_CREATE', userID, companyID, storage, prevTrashAmount, currTrash);
            break;
        case 'PATCH':
            await this.createTrashMethod(method, 'TRASH_UPDATE',
                userID, companyID, storage, prevTrashAmount, currTrash, wmd, companyName, documentNo);
            break;
        case 'DELETE':
            await this.createTrashMethod(method, 'TRASH_DELETE', userID, companyID, storage, prevTrashAmount, currTrash);
            break;
        default:
            break;
    }
};

exports.createTrashMethod = async (method, type, userID, companyID, storage, prevTrashAmount, currTrash, wmd, companyName, documentNo) => {
    const data = {
        method: method,
        transactionType: type,
        trash: currTrash,
        user: userID,
        company: companyID,
        storage: storage,
        previousAmount: storage.amount - (currTrash.amount - prevTrashAmount),
        currentAmount: storage.amount,
        trashAmount: currTrash.amount - prevTrashAmount,
        wmd: wmd,
        sign: currTrash.rSign ? currTrash.rSign : currTrash.dSign,
        companyName: companyName,
        documentNo: documentNo,
        finished: companyName === undefined,
    };
    await logsController.createMethod(data);
};
