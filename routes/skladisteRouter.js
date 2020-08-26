const express = require('express');
const router = express.Router();
const skladiste_controller = require('../controllers/skladiste.controller');

// POST Otpad
router.post('/', skladiste_controller.create);

// GET Skladiste
router.get('/', skladiste_controller.readMany);

// GET Skladiste
router.get('/:id', skladiste_controller.readOne);

// PATCH Skladiste
router.patch('/:id', skladiste_controller.update);

// DELETE Skladiste
router.delete('/:id', skladiste_controller.delete);

// FIX THIS
// GET Skladista
router.get('/firma/:id', skladiste_controller.getSkladistaFirme);

module.exports = router;
