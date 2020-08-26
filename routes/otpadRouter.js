const express = require('express');
const router = express.Router();
const otpad_controller = require('../controllers/otpad.controller');

// POST Otpad
router.post('/', otpad_controller.create);

// GET Otpad
router.get('/', otpad_controller.readMany);

// GET One Otpad
router.get('/:id', otpad_controller.readOne);

// PATCH Otpad
router.patch('/:id', otpad_controller.update);

// DELETE Otpad
router.delete('/:id', otpad_controller.delete);

module.exports = router;
