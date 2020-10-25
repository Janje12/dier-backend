const express = require('express');
const router = express.Router();
const yearlyReportController = require('../controllers/yearlyReport.controller');

// POST
router.post('/', yearlyReportController.create);

// GET
router.get('/', yearlyReportController.readMany);

// GET
router.get('/:id', yearlyReportController.readOne);

// PATCH
router.patch('/:id', yearlyReportController.update);

// DELETE
router.delete('/:id', yearlyReportController.delete);

module.exports = router;
