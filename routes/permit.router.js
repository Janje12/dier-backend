const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permit.controller');

router.post('/', permitController.create);
router.get('/one/:type/:value', permitController.readOne);
router.get('/many/:type/:value', permitController.readMany);
router.patch('/one/:type/:value', permitController.updateOne);
router.patch('/many/:type/:value', permitController.updateMany);
router.delete('/one/:type/:value', permitController.deleteOne);
router.delete('/many/:type/:value', permitController.deleteMany);

module.exports = router;
