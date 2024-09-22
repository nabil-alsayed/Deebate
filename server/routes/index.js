const express = require('express');
const router = express.Router();

// Import the API route module
const v1ApiRoutes = require('./v1/api.route');

// Use the API routes under `/api`
router.use('/api', v1ApiRoutes);

module.exports = router;

