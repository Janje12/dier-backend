const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transakcije.controller');

// GET Transactions[]
router.get('/:trashID', transactionController.findTransports);

module.exports = router;
