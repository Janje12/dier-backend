const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transakcije.controller');

// GET Transactions[]
router.get('/:trashID', transactionController.findTransports);

// GET Transactions[]
router.get('/unfinished/:trashID', transactionController.findUnifinishedDump);

// PATCH Transaction
router.patch('/:id', transactionController.update);

module.exports = router;
