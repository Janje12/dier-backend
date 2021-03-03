const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authLogs = require('../middleware/authLogs.middleware');

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

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;
