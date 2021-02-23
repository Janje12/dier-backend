const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/users/one/:type/:value', adminController.getOneUser);
router.get('/users/many/:type/:value', adminController.getManyUsers);
router.get('/companies/one/:type/:value', adminController.getOneCompany);
router.get('/companies/many/:type/:value', adminController.getManyCompanies);
router.get('/companies/storages/:value', adminController.getCompanyNames);
router.get('/storages/one/:type/:value', adminController.getOneStorage);
router.get('/storages/many/:type/:value', adminController.getManyStorages);
router.get('/permits/one/:type/:value', adminController.getOnePermit);
router.get('/permits/many/:type/:value', adminController.getManyPermits);
module.exports = router;
