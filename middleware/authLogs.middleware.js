const logsController = require('../controllers/transaction.controller');
const tokenController = require('../controllers/token.controller');

exports.authMethod = async (req, resBody) => {
    const method = req.method;
    const type = req.url;
    let token, data, userID, companyID;

    if (method === 'DELETE') {
        data = await tokenController.extractUserInfo(req.headers);
    } else {
        token = resBody.token;
        if (token === undefined)
            return;
        data = await tokenController.extractUserInfo(undefined, token);
    }
    userID = data.user._id;
    companyID = data.company._id;
    switch (method) {
        case 'POST':
            if (type === '/login')
                await this.createAuthMethod(method, 'AUTH_LOGIN', userID, companyID);
            if (type === '/register')
                await this.createAuthMethod(method, 'AUTH_REGISTER', userID, companyID);
            break;
        case 'DELETE':
            await this.createAuthMethod(method, 'AUTH_LOGOUT', userID, companyID);
            break;
        default:
            break;
    }
};

exports.createAuthMethod = async (method, type, userID, companyID) => {
    const data = {
        method: method,
        transactionType: type,
        user: userID,
        company: companyID,
    };
    await logsController.createMethod(data);
};
