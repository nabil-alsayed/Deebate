const express = require('express');
const router = express.Router();

// Import the API route module
const apiRoutes = require('./api.route');

// Use the API routes under `/api`
router.use('/api', apiRoutes);

module.exports = router;

