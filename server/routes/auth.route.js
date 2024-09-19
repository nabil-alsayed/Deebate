const express = require('express');
const router = express.Router();
const authController = require('../controllers/v1/auth.controller');

// Authentication routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);

// TODO: Implement logout route

module.exports = router;
