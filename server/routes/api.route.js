const express = require('express');
const router = express.Router();

// Import entity-specific route modules
const authRoutes = require('./auth.route');
const usersRoutes = require('./users.route');
// const debatesRoutes = require('./debates.route');
// const argumentsRoutes = require('./arguments.route');

// Use routes with base paths
router.use('/auth', authRoutes);    // All authentication routes under /api/auth
router.use('/users', usersRoutes);  // All user routes under /api/users
// router.use('/debates', debatesRoutes);  // All debate routes under /api/debates
// router.use('/arguments', argumentsRoutes);  // All debate routes under /api/debates

module.exports = router;
