const express = require('express');
const router = express.Router();
const delatnost_controller = require('../controllers/delatnost.controller');

// GET Delatnosti
router.get('/', delatnost_controller.readMany);

module.exports = router;
