const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.post('/', transactionController.create);
router.get('/one/:type/:value', transactionController.readOne);
router.get('/many/:type/:value', transactionController.readMany);
router.patch('/one/:type/:value', transactionController.updateOne);
router.patch('/many/:type/:value', transactionController.updateMany);
router.delete('/one/:type/:value', transactionController.deleteOne);
router.delete('/many/:type/:value', transactionController.deleteMany);

// GET all the Transactions[] where the Trash was transported
router.get('/transport/:trashID', transactionController.readTransportTransactions);

// GET Unfinished Transactions[]
router.get('/unfinished/:trashID/:companyID', transactionController.readUnifinshedTransactions);

// add /mostused
router.get('/mostused/:operationType/:count', transactionController.readMostUsedTrash);

module.exports = router;
