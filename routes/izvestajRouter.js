const express = require('express');
const router = express.Router();
const izvestaj_controller = require('../controllers/izvestaj.controller');

// GET Izvestaj
router.get('/', izvestaj_controller.create);


module.exports = router;
