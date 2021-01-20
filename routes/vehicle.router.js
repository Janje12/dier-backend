const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');

router.post('/', vehicleController.create);
router.get('/one/:type/:value', vehicleController.readOne);
router.get('/many/:type/:value', vehicleController.readMany);
router.patch('/one/:type/:value', vehicleController.updateOne);
router.patch('/many/:type/:value', vehicleController.updateMany);
router.delete('/one/:type/:value', vehicleController.deleteOne);
router.delete('/many/:type/:value', vehicleController.deleteMany);

module.exports = router;
