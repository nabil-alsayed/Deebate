// routes/debateRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Debate = require('../models/debate');
const User = require('../models/user'); 
const Argument = require('../models/argument'); 

const { postDebate, getDebates, deleteAllDebates, deleteDebateByID, getDebateByID, updateDebate, updateSpecificField, addArgumentToDebate, getAllArgumentsOfDebate } = require('../controllers/debateController');

// POST /debate
router.post('/debates', postDebate);

// GET /debates
router.get('/debates', getDebates);

router.delete('/debates', deleteAllDebates);

router.delete('/debates/:id', deleteDebateByID);

router.get('/debates/:id', getDebateByID);

router.put('/debates/:id', updateDebate);

router.patch('/debates/:id', updateSpecificField);

//second section
//This endpoint adds a new argument to a specific debate.
router.post('/debates/:debate_id/arguments', addArgumentToDebate);

router.get('/debates/:debate_id/arguments', getAllArgumentsOfDebate);

module.exports = router;