const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/', userController.create);
router.get('/one/:type/:value', userController.readOne);
router.get('/many/:type/:value', userController.readMany);
router.patch('/one/:type/:value', userController.updateOne);
router.patch('/many/:type/:value', userController.updateMany);
router.delete('/one/:type/:value', userController.deleteOne);
router.delete('/many/:type/:value', userController.deleteMany);

router.get('/profile/:username', userController.getUserProfile);

module.exports = router;
