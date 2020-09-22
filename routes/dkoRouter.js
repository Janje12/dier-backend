const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dkoController = require('../controllers/dko.controller');
const trashLogs = require('../middlewear/trashLogs.middlewear');
const trashController = require('../controllers/otpad.controller');


router.use(async (req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];

    const dko = req.body.dko;
    dko._id = mongoose.Types.ObjectId();
    const storageID = req.body.skladiste;
    const trashID = req.body.trash;
    const prevTrash = await trashController.readOneMethod(trashID);
    let currTrash = await trashController.readOneMethod(trashID);
    currTrash.kolicina = currTrash.kolicina - dko.masaOtpada;

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
            if (true) {
                await trashController.updateMethod(trashID, currTrash, storageID);
                await trashLogs.trashMethod(req, 'PATCH', '', storageID, prevTrash, currTrash, dko);
            }
        });
        oldEnd.apply(res, restArgs);
    };
    next();
});
// POST DKO
router.post('/', dkoController.create);

// GET DKO
router.get('/', dkoController.readMany);

// GET DKO
router.get('/:id', dkoController.readOne);

// PATCH DKO
router.patch('/:id', dkoController.update);

// DELETE DKO
router.delete('/:id', dkoController.delete);

module.exports = router;
