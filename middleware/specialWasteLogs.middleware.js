const tokenController = require('../controllers/token.controller');
const logsController = require('../controllers/transaction.controller');

exports.specialWasteMethod = async (req, method, resBody) => {
    const data = await tokenController.extractUserInfo(req.headers);
    const userID = data.user._id;
    const companyID = data.company._id;
    const specialWaste = resBody;
    const specialWasteType = req.body.specialWasteType;
    const amount = req.body.amount;
    switch (method) {
        case 'POST':
            await this.createSpecialWasteMethod(method, 'SPECIAL_WASTE_CREATE', userID, companyID, specialWaste);
            break;
        case 'PATCH':
            await this.createSpecialWasteMethod(method, 'SPECIAL_WASTE_UPDATE',
                userID, companyID, specialWaste, specialWasteType, amount);
            break;
        case 'DELETE':
            await this.createSpecialWasteMethod(method, 'SPECIAL_WASTE_DELETE', userID, companyID, specialWaste);
            break;
        default:
            break;
    }
};

exports.createSpecialWasteMethod = async (method, type, userID, companyID, specialWaste, specialWasteType = undefined, amount = 0) => {
    const data = {
        method: method,
        transactionType: type,
        user: userID,
        company: companyID,
        specialWaste: specialWaste,
        specialWasteType: specialWasteType,
        trashAmount: amount,
    };
    await logsController.createMethod(data);
};
