const authLogs = require('./authLogs.middleware');
const logsController = require('../controllers/transaction.controller');

exports.specialWasteMethod = async (req, method, resBody) => {
    const token = req.headers['authorization'].split(' ')[1];
    const data = await authLogs.extractUserInfo(token);
    const userID = data.user._id;
    const companyID = data.company._id;
    const specialWaste = req.specialWaste;
    const specialWasteType = req.body.specialWasteType;
    switch (method) {
        case 'POST':
            await this.createSpecialWasteMethod(method, 'SPECIAL_WASTE_CREATE', userID, companyID, specialWaste);
            break;
        case 'PATCH':
            await this.createSpecialWasteMethod(method, 'SPECIAL_WASTE_UPDATE',
                userID, companyID, specialWaste, specialWasteType);
            break;
        case 'DELETE':
            await this.createSpecialWasteMethod(method, 'SPECIAL_WASTE_DELETE', userID, companyID, specialWaste);
            break;
        default:
            break;
    }
};

exports.createSpecialWasteMethod = async (method, type, userID, companyID, specialWaste, specialWasteType = undefined) => {
    const data = {
        method: method,
        transactionType: type,
        user: userID,
        company: companyID,
        specialWaste: specialWaste,
        specialWasteType: specialWasteType,
        trashAmount: specialWaste.amount,
    };
    await logsController.createMethod(data);
};
