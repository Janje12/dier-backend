const express = require('express');
const router = express.Router();
const opasniOtpad_controller = require('../controllers/opasni-otpad.controller');
const transakcija_controller = require('../controllers/transakcije.controller');
const jwt = require('jsonwebtoken');

router.use(async (req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];
    let prevTrash;

    if (req.method === 'PATCH') {
        const id = req.body.otpad._id;
        prevTrash = await opasniOtpad_controller.readOneMethod(id);
        console.log(prevTrash.kolicina);
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
        const currTrash = JSON.parse(resBody);
        const token = req.headers['authorization'].split(' ')[1];
        const data = jwt.decode(token).data;
        const userID = data.korisnik._id;
        const companyID = data.firma._id;
        const storageID = req.body.skladiste;
        res.on('finish', function () {
            transakcija_controller.trashMethod(req.method, userID, companyID, storageID, prevTrash, currTrash);
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
router.delete('/:id', opasniOtpad_controller.delete);

module.exports = router;
