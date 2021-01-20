const express = require('express');
const router = express.Router();
// GET (FIND) ONE Firma
router.get('/admin/:type/:value', companyController.findOne);

// GET (FIND) ONE Firma
router.get('/admin/many/:type/:value', companyController.findMany);

router.get('/admin/:type/:value', skladiste_controller.findOne);
// GET (FIND) ONE Korisnik
router.get('/admin/:type/:value', userController.findOne);

module.exports = router;
