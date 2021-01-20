const express = require('express');
const router = express.Router();
const yearlyReportController = require('../controllers/yearlyReport.controller');

router.post('/', yearlyReportController.create);
router.get('/one/:type/:value', yearlyReportController.readOne);
router.get('/many/:type/:value', yearlyReportController.readMany);
router.patch('/one/:type/:value', yearlyReportController.updateOne);
router.patch('/many/:type/:value', yearlyReportController.updateMany);
router.delete('/one/:type/:value', yearlyReportController.deleteOne);
router.delete('/many/:type/:value', yearlyReportController.deleteMany);

module.exports = router;
