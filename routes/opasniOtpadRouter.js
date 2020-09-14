const express = require('express');
const router = express.Router();
const opasniOtpad_controller = require('../controllers/opasni-otpad.controller');
const transakcija_controller = require('../controllers/transakcije.controller');

router.use(async (req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];
    let storageID, prevTrash;

    if (req.method === 'PATCH' || req.method === 'DELETE') {
        let id = req.url.split('/')[1];
        storageID = req.url.split('/')[2];
        prevTrash = await opasniOtpad_controller.readOneMethod(id);
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
            await transakcija_controller.trashMethod(req, JSON.parse(resBody), storageID, prevTrash);
        });
        oldEnd.apply(res, restArgs);
    };
    next();
});

// POST Otpad
router.post('/', opasniOtpad_controller.create);

// GET Otpad
router.get('/', opasniOtpad_controller.readMany);

// GET One Otpad
router.get('/:id', opasniOtpad_controller.readOne);

// PATCH Otpad
router.patch('/:id', opasniOtpad_controller.update);

// DELETE Otpad
router.delete('/:id/:skladisteID', opasniOtpad_controller.delete);

module.exports = router;
