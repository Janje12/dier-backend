const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');
const transakcija_controller = require('../controllers/transakcije.controller');
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];
    let token, data, userID, companyID;
    if (req.method === 'DELETE') {
        token = req.headers['authorization'].split(' ')[1];
        data = jwt.decode(token).data;
        userID = data.korisnik._id;
        companyID = data.firma._id;
    }

    res.write = (...restArgs) => {
        chunks.push(Buffer.from(restArgs[0]));
        oldWrite.apply(res, restArgs);
    };

    res.end = async (...restArgs) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const resBody = Buffer.concat(chunks).toString('utf8');
        if (false) {
            token = JSON.parse(resBody).token;
            data = jwt.decode(token).data;
            userID = data.korisnik._id;
            companyID = data.firma._id;
        }
        res.on('finish', function () {
            transakcija_controller.authMethod(req.method, req.url, userID, companyID);
        });
        oldEnd.apply(res, restArgs);
    };

    next();
});

// POST Register
router.post('/register', auth_controller.register);

// POST Login
router.post('/login', auth_controller.login);

// POST Refresh Token
router.post('/refresh', auth_controller.refresh);

// DELETE Logout
router.delete('/logout', auth_controller.logout);

module.exports = router;
