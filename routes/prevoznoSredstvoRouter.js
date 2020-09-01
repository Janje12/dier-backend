const express = require('express');
const router = express.Router();
const prevoznoSredstvo_controller = require('../controllers/prevozno-sredstvo.controller');

// POST prevoznoSredstvo
router.post('/', prevoznoSredstvo_controller.create);

// GET prevoznoSredstvo
router.get('/', prevoznoSredstvo_controller.readMany);

// GET prevoznoSredstvo
router.get('/:id', prevoznoSredstvo_controller.readOne);

// PATCH prevoznoSredstvo
router.patch('/:id', prevoznoSredstvo_controller.update);

// DELETE prevoznoSredstvo
router.delete('/:id', prevoznoSredstvo_controller.delete);

// FIX THIS
// GET prevoznoSredstvo
router.get('/firma/:id', prevoznoSredstvo_controller.getPrevoznoSredstvoFirme);

module.exports = router;
