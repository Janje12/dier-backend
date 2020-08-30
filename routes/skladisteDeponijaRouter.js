const express = require('express');
const router = express.Router();
const skladisteDeponija_controller = require('../controllers/skladiste-deponija.controller');

// POST Otpad
router.post('/', skladisteDeponija_controller.create);

// GET Skladiste
router.get('/', skladisteDeponija_controller.readMany);

// GET Skladiste
router.get('/:id', skladisteDeponija_controller.readOne);

// PATCH Skladiste
router.patch('/:id', skladisteDeponija_controller.update);

// DELETE Skladiste
router.delete('/:id', skladisteDeponija_controller.delete);

// FIX THIS
// GET Skladista
router.get('/firma/:id', skladisteDeponija_controller.getSkladistaFirme);

module.exports = router;
