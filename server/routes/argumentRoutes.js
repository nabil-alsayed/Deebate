const express = require('express');
const router = express.Router();

const { getArgumentById } = require('../controllers/argumentController');

router.get('/arguments/:id', getArgumentById);

module.exports = router;