const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail.controller');

router.get('/verify/:verificationToken', mailController.verify);
router.post('/contact', mailController.contact);

module.exports = router;
