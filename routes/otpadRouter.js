const express = require('express');
const router = express.Router();
const otpad_controller = require('../controllers/otpad.controller');
const trashLogs = require('../middlewear/trashLogs.middlewear');

router.use(async (req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];
    let storageID, prevTrash, currTrash;

    if (req.method === 'PATCH' || req.method === 'DELETE') {
        let id = req.url.split('/')[1];
        storageID = req.url.split('/')[2];
        prevTrash = await otpad_controller.readOneMethod(id);
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

// POST Otpad
router.post('/', otpad_controller.create);

// GET Otpad
router.get('/', otpad_controller.readMany);

// GET One Otpad
router.get('/:id', otpad_controller.readOne);

// PATCH Otpad
router.patch('/:id', otpad_controller.update);

// DELETE Otpad
router.delete('/:id/:skladiste', otpad_controller.delete);

module.exports = router;
