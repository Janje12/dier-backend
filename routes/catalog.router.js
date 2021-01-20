const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');

router.post('/', catalogController.create);
router.get('/one/:type/:value', catalogController.readOne);
router.get('/many/:type/:value', catalogController.readMany);
router.patch('/one/:type/:value', catalogController.updateOne);
router.patch('/many/:type/:value', catalogController.updateMany);
router.delete('/one/:type/:value', catalogController.deleteOne);
router.delete('/many/:type/:value', catalogController.deleteMany);

// Get only safe or unsafe trash from catalog
router.get('/safe', catalogController.getSafeCatalog);
router.get('/unsafe', catalogController.getUnsafeCatalog);

module.exports = router;

