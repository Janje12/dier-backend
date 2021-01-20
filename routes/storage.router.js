const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storage.controller');

router.post('/', storageController.create);
router.get('/one/:type/:value', storageController.readOne);
router.get('/many/:type/:value', storageController.readMany);
router.patch('/one/:type/:value', storageController.updateOne);
router.patch('/many/:type/:value', storageController.updateMany);
router.delete('/one/:type/:value', storageController.deleteOne);
router.delete('/many/:type/:value', storageController.deleteMany);

module.exports = router;
