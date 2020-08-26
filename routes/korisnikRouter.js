const express = require('express');
const router = express.Router();
const korisnik_controller = require('../controllers/korisnik.controller');

// GET Korisnici
router.get('/', korisnik_controller.readMany);

// GET 1 Korisnik profile
router.get('/:id', korisnik_controller.getProfileKorisnik);
// POST Korisnik
// UPDATE Korisnik
// DELETE Korisnik

module.exports = router;
