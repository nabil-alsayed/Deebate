const express = require('express');
const router = express.Router();

// Import the API controller module
const apiController = require('../../controllers/v1/api.controller');

// Import entity-specific route modules
const authRoutes = require('./auth.route');
const usersRoutes = require('./users.route');
const debatesRoutes = require('./debates.route');

// Use routes with base paths
router.use('/v1/auth', authRoutes);
router.use('/v1/users', usersRoutes);
router.use('/v1/debates', debatesRoutes);

// API Root Route
router.get('/', apiController.getApiRoot);

// Error Handler Middleware
router.use(apiController.handleError);

router.use('*', apiController.handleNotFound);

module.exports = router;
