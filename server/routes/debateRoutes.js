// routes/debateRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Debate = require('../models/debate');
const User = require('../models/user'); 
const Argument = require('../models/argument'); 

// POST /debate
router.post('/debates', async function (req, res, next) {
  const { topic, endTime, creator } = req.body;
  const debate = new Debate(req.body);
  // Basic validation
  if (!topic || !endTime || !creator) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check that endTime is in the future
  if (new Date(endTime) <= new Date()) {
    return res.status(400).json({ message: 'End time must be in the future' });
  }

  try {
    
    await debate.save();
    
  } catch (err) {
    return next(err);
  }
  res.status(201).json(debate);
});

// GET /debates
router.get('/debates', async function(req, res, next) {
  try {
    // Find all debates and populate references to creator and arguments
    const debates = await Debate.find();
    // Send the retrieved debates as JSON response
    res.json({ "debates": debates });
  } catch (err) {
    // Pass any errors to the next middleware (usually an error handler)
    return next(err);
  }
});

router.delete('/debates', async function(req, res, next) {
  try {
    const result = await Debate.deleteMany();
    
    // Check if any debates were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No debates found to delete' });
    }
    
    // Respond with the number of debates deleted
    res.status(200).json({ message: `${result.deletedCount} debates deleted successfully` });
    
  } catch (err) {
    return next(err);
  }
});

router.delete('/debates/:id', async function(req, res, next) {
  const id = req.params.id; // Using const for id as it's not reassigned
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID format' });
  }
  
  try {
    const debate = await Debate.findByIdAndDelete(id);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    res.status(200).json({ message: 'Debate deleted successfully', debate });
  } catch (err) {
    return next(err);
  }
});

router.get('/debates/:id', async function(req, res, next) {
  const id = req.params.id; // Using const for id as it's not reassigned
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID format' });
  }
  
  try {
    const debate = await Debate.findById(id);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    res.status(200).json({ message: 'Debate found successfully', debate });
  } catch (err) {
    return next(err);
  }
});



router.put('/debates/:id', async function(req, res, next) {
  const id = req.params.id;
  const {topic, status, endTime} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({message: "Invalid ID format"});
  }

  if (!topic || !endTime){
    return res.status(404).json({message: "Missing required fields"});
  }

  try {
    // Find the debate by ID and update
    const updatedDebate = await Debate.findByIdAndUpdate(
      id,
      { topic, status, endTime },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    // Check if the debate was found and updated
    if (!updatedDebate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    res.status(200).json({message: "Fields were updated", updatedDebate});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;