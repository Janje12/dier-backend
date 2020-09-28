const express = require('express');
const router = express.Router();
const skladisteTretman_controller = require('../controllers/skladiste-tretman.controller');

// POST Skladiste
router.post('/', skladisteTretman_controller.create);

// GET Skladiste[]
router.get('/', skladisteTretman_controller.readMany);

// GET Skladiste
router.get('/:id', skladisteTretman_controller.readOne);

// PATCH Skladiste
router.patch('/:id', skladisteTretman_controller.update);

// DELETE Skladiste
router.delete('/:id', skladisteTretman_controller.delete);

// FIX THIS
// GET Skladista
router.get('/firma/:id', skladisteTretman_controller.getSkladistaFirme);

module.exports = router;
