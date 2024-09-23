const express = require('express');
const router = express.Router();
const authController = require('../../controllers/v1/auth.controller');

// Authentication routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/signup', authController.signup);

module.exports = router;
