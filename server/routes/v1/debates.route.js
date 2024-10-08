const express = require('express');
const router = express.Router();
const debateController = require('../../controllers/v1/debate.controller');
const argumentRoutes = require('./arguments.route');
const methodOverride = require('method-override');
const {authenticateRole} = require("../../utils/utils");

// Debate routes
router.post('/',authenticateRole("user"), debateController.postDebate);
router.get('/', debateController.getDebates);
router.delete('/',authenticateRole("admin"), debateController.deleteAllDebates);
router.delete('/user/:userId',authenticateRole("user"),  debateController.deleteAllUserDebates);
router.post('/:debateId/join',authenticateRole("user"), debateController.joinDebate);
router.patch('/:debateId/vote', authenticateRole("user"), debateController.voteDebate);

// Apply method-override of a specific debate
router.use('/:debateId', methodOverride('X-HTTP-Method-Override'), authenticateRole('user'));

// Apply method override for these specific delete routes
router.delete('/:debateId/',authenticateRole("user"), debateController.deleteDebateByID);
router.delete('/user/:userId/:debateId',authenticateRole("user"), debateController.deleteSpecificUserDebate);

// Other routes
router.get('/:debateId',authenticateRole("user"), debateController.getDebateByID);
router.put('/:debateId',authenticateRole("user"), debateController.updateDebate);
router.patch('/:debateId',authenticateRole("user"), debateController.updateDebate);

router.use('/:debateId/arguments', argumentRoutes);

module.exports = router;
