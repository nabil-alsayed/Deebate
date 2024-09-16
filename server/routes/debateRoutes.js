// routes/debateRoutes.js
const express = require('express');
const router = express.Router();

const Debate = require('../models/debate');
const User = require('../models/user'); 
const Argument = require('../models/argument'); 

// POST /debate
router.post('/debates', async function (req, res, next) {
  const { topic, endTime, creator } = req.body;

  // Basic validation
  if (!topic || !endTime || !creator) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check that endTime is in the future
  if (new Date(endTime) <= new Date()) {
    return res.status(400).json({ message: 'End time must be in the future' });
  }

  try {
    const debate = new Debate(req.body);
    await debate.save();
    res.status(201).json(debate);
  } catch (err) {
    return next(err);
  }
});

// GET /debates
router.get('/debates', async function (req, res, next) {
  try {
    const debates = await Debate.find().populate('creator arguments');
    res.status(200).json(debates);
  } catch (err) {
    return next(err);
  }
});

// // PATCH /debate/:id
// router.patch('/debate/:id', async function (req, res, next) {
//   const debateId = req.params.id;
  
//   try {
//     const updatedDebate = await Debate.findByIdAndUpdate(debateId, req.body, { new: true });
//     if (!updatedDebate) {
//       return res.status(404).json({ message: 'Debate not found' });
//     }
//     res.status(200).json(updatedDebate);
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = router;