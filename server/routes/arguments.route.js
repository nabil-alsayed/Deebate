// routes/debateRoutes.js
const express = require('express');
const router = express.Router();
const argumentController = require('../controllers/v1/argument.controller');

router.get('/:id', argumentController.getArgumentById);

module.exports = router;