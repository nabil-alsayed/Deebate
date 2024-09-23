const express = require('express');
const router = express.Router();
const debateController = require('../../controllers/v1/debate.controller');
const argumentRoutes = require('./arguments.route');
const methodOverride = require('method-override');

// Debate routes
router.post('/', debateController.postDebate);
router.get('/', debateController.getDebates);
router.delete('/', debateController.deleteAllDebates);
router.delete('/user/:userId', debateController.deleteAllUserDebates);
router.post('/:debateId/join', debateController.joinDebate);

// Apply method-override of a specific debate
router.use('/:debateId', methodOverride('X-HTTP-Method-Override'));

// Apply method override for these specific delete routes
router.delete('/:debateId/', debateController.deleteDebateByID);
router.delete('/user/:userId/:debateId', debateController.deleteSpecificUserDebate);

// Other routes
router.get('/:debateId', debateController.getDebateByID);
router.put('/:debateId', debateController.updateDebate);
router.patch('/:debateId', debateController.updateDebate);

router.use('/:debateId/arguments', argumentRoutes);

module.exports = router;
