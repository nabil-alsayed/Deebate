const express = require('express');
const router = express.Router({ mergeParams: true });
const argumentController = require('../controllers/v1/argument.controller');
const commentRoutes = require('./comments.route');

// Argument routes (nested under debates)
router.post('/', argumentController.createArgument);
router.get('/', argumentController.getAllArguments);
router.get('/:argumentId', argumentController.getArgumentById);
router.delete('/:argumentId', argumentController.deleteArgument);
router.put('/:argumentId', argumentController.editArgument);
router.patch('/:argumentId', argumentController.editArgument);

// Use comment routes, nested under arguments
router.use('/:argumentId/comments', commentRoutes);

module.exports = router;
