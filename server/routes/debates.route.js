const express = require('express');
const router = express.Router();
const debateController = require('../controllers/v1/debate.controller');
const argumentRoutes = require('../routes/arguments.route');

// Debate routes
router.post('/', debateController.postDebate);
router.get('/', debateController.getDebates);
router.delete('/', debateController.deleteAllDebates);
router.post ('/:debateId', debateController.joinDebate);
router.delete('/:debateId', debateController.deleteDebateByID);
router.get('/:debateId', debateController.getDebateByID);
router.put('/:debateId', debateController.updateDebate);
router.patch('/:debateId', debateController.updateSpecificField);

router.use('/:debateId/arguments', argumentRoutes);

module.exports = router;
