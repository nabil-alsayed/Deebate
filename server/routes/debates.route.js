// routes/debateRoutes.js
const express = require('express');
const router = express.Router();
const debateController = require('../controllers/v1/debate.controller');

// Debate routes
router.post('/', debateController.postDebate);
router.get('/', debateController.getDebates);
router.delete('/', debateController.deleteAllDebates);
router.delete('/:id', debateController.deleteDebateByID);
router.get('/:id', debateController.getDebateByID);
router.put('/:id', debateController.updateDebate);
router.patch('/:id', debateController.updateSpecificField);

//second section
//This endpoint adds a new argument to a specific debate.
router.post('/debates/:debate_id/arguments', debateController.addArgumentToDebate);

module.exports = router;