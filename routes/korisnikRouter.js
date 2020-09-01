const express = require('express');
const router = express.Router();
const korisnik_controller = require('../controllers/korisnik.controller');

// GET Korisnici
router.get('/', korisnik_controller.readMany);

// GET Korisnik
router.get('/:id', korisnik_controller.readOne);

// PATCH Korisnik
router.patch('/:id', korisnik_controller.update);

// DELETE Korisnik
router.delete('/:id', korisnik_controller.delete);

// GET 1 Korisnik profile
router.get('/profile/:id', korisnik_controller.getProfileKorisnik);

module.exports = router;
