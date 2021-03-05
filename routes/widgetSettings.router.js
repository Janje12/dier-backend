const express = require('express');
const router = express.Router();
const widgetSettingsController = require('../controllers/widgetSettings.controller');

router.post('/', widgetSettingsController.create);
router.get('/one/:type/:value', widgetSettingsController.readOne);
router.get('/many/:type/:value', widgetSettingsController.readMany);
router.patch('/one/:type/:value', widgetSettingsController.updateOne);
router.patch('/many/:type/:value', widgetSettingsController.updateMany);
router.delete('/one/:type/:value', widgetSettingsController.deleteOne);
router.delete('/many/:type/:value', widgetSettingsController.deleteMany);

module.exports = router;
