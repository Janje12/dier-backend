const express = require('express');
const router = express.Router();
const monthlyReportController = require('../controllers/monthlyReport.controller');

router.post('/', monthlyReportController.create);
router.get('/one/:type/:value', monthlyReportController.readOne);
router.get('/many/:type/:value', monthlyReportController.readMany);
router.patch('/one/:type/:value', monthlyReportController.updateOne);
router.patch('/many/:type/:value', monthlyReportController.updateMany);
router.delete('/one/:type/:value', monthlyReportController.deleteOne);
router.delete('/many/:type/:value', monthlyReportController.deleteMany);
// FIND ALL FIRMA
router.get('/:pib', izvestaj_controller.findByFirma); // can be changed to /many/:company/:id
module.exports = router;
