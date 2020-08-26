const express = require('express');
const router = express.Router();
const opasniOtpad_controller = require('../controllers/opasni-otpad.controller');

// POST Otpad
router.post('/', opasniOtpad_controller.create);

// GET Otpad
router.get('/', opasniOtpad_controller.readMany);

// GET One Otpad
router.get('/:id', opasniOtpad_controller.readOne);

// PATCH Otpad
router.patch('/:id', opasniOtpad_controller.update);

// DELETE Otpad
router.delete('/:id', opasniOtpad_controller.delete);

module.exports = router;
