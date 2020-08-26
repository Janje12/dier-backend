const express = require('express');
const router = express.Router();
const dozvola_controller = require('../controllers/dozvole_controller');

// POST Otpad
router.post('/', dozvola_controller.create);

// GET Skladiste
router.get('/', dozvola_controller.readMany);

// GET Skladiste
router.get('/:id', dozvola_controller.readOne);

// PATCH Skladiste
router.patch('/:id', dozvola_controller.update);

// DELETE Skladiste
router.delete('/:id', dozvola_controller.delete);

// FIX THIS
// GET Skladista
router.get('/firma/:id', dozvola_controller.getDozvolaFirme);

module.exports = router;
