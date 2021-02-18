const express = require('express');
const router = express.Router();
const specialWasteController = require('../controllers/specialWaste.controller');
const specialWasteLogs = require('../middlewear/specialWasteLogs.middleware');

router.use(async (req, res, next) => {
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
                await specialWasteLogs.specialWasteMethod(req, req.method, JSON.parse(resBody));
        });
        oldEnd.apply(res, restArgs);
    };
    next();
});

router.post('/', specialWasteController.create);
router.get('/one/:type/:value', specialWasteController.readOne);
router.get('/many/:type/:value', specialWasteController.readMany);
router.patch('/one/:type/:value', specialWasteController.updateOne);
// router.patch('/many/:type/:value', trashController.updateMany); WIP
router.delete('/one/:type/:value/:storageID', specialWasteController.deleteOne);
// router.delete('/many/:type/:value/:storageID', trashController.deleteMany); WIP

module.exports = router;
