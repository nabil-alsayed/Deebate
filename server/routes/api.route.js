const express = require('express');
const router = express.Router();

// Import the API controller module
const apiController = require('../controllers/v1/api.controller');

// Import entity-specific route modules
const authRoutes = require('./auth.route');
const usersRoutes = require('./users.route');
const debatesRoutes = require('./debates.route');
// const argumentsRoutes = require('./arguments.route');

// Use routes with base paths
router.use('/auth', authRoutes);    // All authentication routes under /api/auth
router.use('/users', usersRoutes);  // All user routes under /api/users
router.use('/debates', debatesRoutes);  // All debate routes under /api/debates
// router.use('/arguments', argumentsRoutes);  // All debate routes under /api/debates

// API Root Route
router.get('/', apiController.getApiRoot);

// Error Handler Middleware
router.use(apiController.handleError);

// Catch all non-error handler for api (i.e., 404 Not Found)
router.use('*', apiController.handleNotFound);

module.exports = router;
