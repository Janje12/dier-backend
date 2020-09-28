const express = require('express');
const router = express.Router();
const firma_controller = require('../controllers/firma.controller');

// POST Firma
router.post('/', firma_controller.create);

// GET Firma
router.get('/', firma_controller.readMany);

// GET Firma
router.get('/:id', firma_controller.readOne);

// GET (FIND) ONE Firma
router.get('/admin/:type/:value', firma_controller.findOne);

// GET (FIND) ONE Firma
router.get('/admin/many/:type/:value', firma_controller.findMany);

// PATCH Firma
router.patch('/:id', firma_controller.update);

// DELETE Firma
router.delete('/:id', firma_controller.delete);

module.exports = router;
