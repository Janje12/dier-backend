const express = require('express');
const router = express.Router();
const mesto_controller = require('../controllers/mesto.controller');

// GET opstinaNaziv
router.get('/opstine', mesto_controller.readOpstine);

// POST
router.post('/', mesto_controller.create);

// GET
router.get('/', mesto_controller.readMany);

// GET
router.get('/:id', mesto_controller.readOne);

// PATCH
router.patch('/:id', mesto_controller.update);

// DELETE
router.delete('/:id', mesto_controller.delete);


// GET 1 Mesto.mesto.naziv
router.get('/mesta/:naziv', mesto_controller.readNazivMesto);

module.exports = router;
