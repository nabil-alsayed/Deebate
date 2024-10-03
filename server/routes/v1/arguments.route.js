const express = require('express');
const router = express.Router({ mergeParams: true });
const argumentController = require('../../controllers/v1/argument.controller');
const commentRoutes = require('./comments.route');
const methodOverride = require('method-override');
const {authenticateRole} = require("../../utils/utils");

// Apply method-override of one specific argument
router.use('/:argumentId', methodOverride('X-HTTP-Method-Override'),authenticateRole("user"));

// Argument routes 
router.post('/',authenticateRole("user"), argumentController.createArgument);
router.get('/', argumentController.getAllArguments);
router.get('/:argumentId', argumentController.getArgumentById);

router.delete('/:argumentId',authenticateRole("user"), argumentController.deleteArgument);
router.put('/:argumentId',authenticateRole("user"), argumentController.editArgument);
router.patch('/:argumentId',authenticateRole("user"), argumentController.editArgument);

// Use comment routes, nested under arguments
router.use('/:argumentId/comments', commentRoutes);

module.exports = router;
