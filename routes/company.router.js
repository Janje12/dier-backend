const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

router.post('/', companyController.create);
router.get('/one/:type/:value', companyController.readOne);
router.get('/many/:type/:value', companyController.readMany);
router.patch('/one/:type/:value', companyController.updateOne);
router.patch('/many/:type/:value', companyController.updateMany);
router.delete('/one/:type/:value', companyController.deleteOne);
router.delete('/many/:type/:value', companyController.deleteMany);

// Get all of specific type permits or all permits if type isn't defined
router.get('/permits/:companyID/:permitType', companyController.readCompaniesPermits);
// Get all of companies vehicles
router.get('/vehicles/:companyID', companyController.readCompaniesVehicles);
// Get all of specific type storages or all storages if type isn't defined
router.get('/storages/:companyID/:storageType', companyController.readCompaniesStorages);

module.exports = router;
