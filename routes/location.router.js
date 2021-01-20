const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

router.post('/', locationController.create);
router.get('/one/:type/:value', locationController.readOne);
router.get('/many/:type/:value', locationController.readMany);
router.patch('/one/:type/:value', locationController.updateOne);
router.patch('/many/:type/:value', locationController.updateMany);
router.delete('/one/:type/:value', locationController.deleteOne);
router.delete('/many/:type/:value', locationController.deleteMany);

// GET townshipsName[]
router.get('/townships', locationController.readTownshipNames);

// GET placeNames[] for township name
router.get('/place/:townshipName', locationController.readPlaceNames);

module.exports = router;
