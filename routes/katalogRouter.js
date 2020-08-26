const express = require('express');
const router = express.Router();
const katalog_controller = require('../controllers/katalog.controller');

// GET Katalog
router.get('/', katalog_controller.readMany);

router.get('/:type', katalog_controller.readMany);

module.exports = router;
