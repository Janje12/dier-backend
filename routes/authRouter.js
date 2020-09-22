const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');
const authLogs = require('../middlewear/authLogs.middlewear');

router.use((req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];

    res.write = (...restArgs) => {
        chunks.push(Buffer.from(restArgs[0]));
        oldWrite.apply(res, restArgs);
    };

    res.end = async (...restArgs) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const resBody = Buffer.concat(chunks).toString('utf8');
        res.on('finish', async function () {
            if (res.statusCode >= 200 && res.statusCode < 300)
                await authLogs.authMethod(req, JSON.parse(resBody));
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
