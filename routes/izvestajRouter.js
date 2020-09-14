const express = require('express');
const router = express.Router();
const izvestaj_controller = require('../controllers/izvestaj.controller');

// POST
router.post('/', izvestaj_controller.create);

// GET
router.get('/', izvestaj_controller.readMany);

// GET
router.get('/:id', izvestaj_controller.readOne);

// PATCH
router.patch('/:id', izvestaj_controller.update);

// DELETE
router.delete('/:id', izvestaj_controller.delete);

module.exports = router;
