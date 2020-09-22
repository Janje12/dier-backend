const express = require('express');
const router = express.Router();
const skladisteSkladistenjeController = require('../controllers/skladiste.controller');

// POST Otpad
router.post('/', skladisteSkladistenjeController.create);

// GET Skladiste
router.get('/', skladisteSkladistenjeController.readMany);

// GET Skladiste
router.get('/:id', skladisteSkladistenjeController.readOne);

// PATCH Skladiste
router.patch('/:id', skladisteSkladistenjeController.update);

// DELETE Skladiste
router.delete('/:id', skladisteSkladistenjeController.delete);

// FIX THIS
// GET Skladista
router.get('/firma/:id', skladisteSkladistenjeController.getSkladistaSkladistenjeFirme);

module.exports = router;
