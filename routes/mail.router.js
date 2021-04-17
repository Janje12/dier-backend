const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail.controller');

router.get('/verify/:verificationToken', mailController.verify);
router.post('/contact', mailController.contact);
router.post('/contact-site', mailController.contactSite);
router.post('/permit-request', mailController.permitRequest);

module.exports = router;
