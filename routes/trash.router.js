const express = require('express');
const router = express.Router();
const trashController = require('../controllers/trash.controller');
const trashLogs = require('../middlewear/trashLogs.middlewear');

router.use(async (req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];
    let storageID, prevTrash;

    if (req.method === 'PATCH' || req.method === 'DELETE') {
        let id = req.url.split('/')[1];
        storageID = req.url.split('/')[2];
        prevTrash = await trashController.readOneMethod(id);
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
        res.on('finish', async function () {
            if (res.statusCode >= 200 && res.statusCode < 300)
                await trashLogs.trashMethod(req, req.method, JSON.parse(resBody), storageID, prevTrash);
        });
        oldEnd.apply(res, restArgs);
    };
    next();
});

router.post('/', trashController.create);
router.get('/one/:type/:value', trashController.readOne);
router.get('/many/:type/:value', trashController.readMany);
router.patch('/one/:type/:value', trashController.updateOne);
// router.patch('/many/:type/:value', trashController.updateMany); WIP
router.delete('/one/:type/:value/:storageID', trashController.deleteOne);
// router.delete('/many/:type/:value/:storageID', trashController.deleteMany); WIP

module.exports = router;
