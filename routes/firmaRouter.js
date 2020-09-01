const express = require('express');
const router = express.Router();
const firma_controller = require('../controllers/firma.controller');

// POST Firma
router.post('/', firma_controller.create);

// GET Firma
router.get('/', firma_controller.readMany);

// GET Firma
router.get('/:id', firma_controller.readOne);

// PATCH Firma
router.patch('/:id', firma_controller.update);

// DELETE Firma
router.delete('/:id', firma_controller.delete);

module.exports = router;
