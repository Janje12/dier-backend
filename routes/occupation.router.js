const express = require('express');
const router = express.Router();
const occupationController = require('../controllers/occupation.controller');

router.post('/', occupationController.create);
router.get('/one/:type/:value', occupationController.readOne);
router.get('/many/:type/:value', occupationController.readMany);
router.patch('/one/:type/:value', occupationController.updateOne);
router.patch('/many/:type/:value', occupationController.updateMany);
router.delete('/one/:type/:value', occupationController.deleteOne);
router.delete('/many/:type/:value', occupationController.deleteMany);

module.exports = router;
