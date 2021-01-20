const jwt = require('jsonwebtoken');
const logsController = require('../controllers/transaction.controller');

exports.extractUserInfo = async (token) => {
    const data = jwt.decode(token).data;
    return data;
};

exports.authMethod = async (req, resBody) => {
    const method = req.method;
    const type = req.url;
    let token, data, userID, companyID;

    if (method === 'DELETE') {
        token = req.headers['authorization'].split(' ')[1];
        data = await this.extractUserInfo(token);
        userID = data.korisnik._id;
        companyID = data.firma._id;
    } else {
        token = resBody.token;
        data = await this.extractUserInfo(token);
        userID = data.korisnik._id;
        companyID = data.firma._id;
    }

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
        metoda: method,
        vrstaTransakcije: type,
        korisnik: userID,
        firma: companyID,
    };
    await logsController.createMethod(data);
};
