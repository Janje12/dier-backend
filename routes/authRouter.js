const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');

router.use((req, res, next) => {
    next();
});

// POST Register
router.post('/register', auth_controller.register);

// POST Login
router.post('/login', auth_controller.login);

// POST Refresh Token
router.post('/refresh', auth_controller.refresh);

// DELETE Logout
router.delete('/logout', auth_controller.logout);

module.exports = router;
