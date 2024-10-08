/* This controller is for managing the Arguments Endpoints */

const mongoose = require('mongoose');
const Debate = require('../../models/debate');
const Argument = require('../../models/argument');
const Comment = require('../../models/comment');


// Create a new argument
const createArgument =  async (req, res, next) => {

  const { debateId } = req.params;
  const { content, userId } = req.body;

  try {
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    if(debate.status !== 'open'){
      return res.status(403).json({ message: 'Debate is closed' });
    }

    if(debate.participants.indexOf(userId) === -1){
      return res.status(403).json({ message: 'User is not a debater' });
    }

    // Create a new argument (assuming you have an Argument model)
    const argument = new Argument({
      content,
      owner: userId,
      debate: debateId,
    });
    await argument.save();

    // Add the argument to the debate's arguments array
    debate.arguments.push(argument._id);
    await debate.save();

    res.status(201).json(argument);
  } catch (err) {
    return next(err);
  }
};

// Get all arguments
const getAllArguments = async (req, res) => {
  const { debateId } = req.params;
  try {
    const debate = await Debate.findById(debateId).populate('arguments');

    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }


    if (debate.arguments.length === 0) {
      return res.status(404).json({ message: 'No arguments found for this debate' });
    }

    res.status(200).json(debate.arguments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get specific argument by ID
const getArgumentById = async (req, res) => {
  const { debateId, argumentId } = req.params;
  try {
    const argument = await Argument.findById(argumentId).populate('comments');
    if (!argument) {
      return res.status(404).json({ error: 'Argument not found' });
    }
    res.status(200).json(argument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete specific argument by ID
const deleteArgument = async (req, res) => {
  const { debateId, argumentId } = req.params;
  try {
    const argument = await Argument.findById(argumentId);
    if (!argument) {
      return res.status(404).json({ error: 'Argument not found' });
    }
    // TODO: Check ownership

    // Delete associated comments
    await Comment.deleteMany({ _id: { $in: argument.comments } });

    // Delete the argument
    await argument.deleteOne();
    res
      .status(204)
      .json({ message: 'Argument and associated comments deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all arguments of a specific debate
const deleteAllArgumentsOfDebate = async (req, res) => {
  const { debateId } = req.params;

  try {
    // Find the debate by ID
    const debate = await Debate.findById(debateId);

    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    // Delete all arguments associated with the debate
    await Argument.deleteMany({ _id: { $in: debate.arguments } });

    // Clear the arguments array in the debate document
    debate.arguments = [];
    await debate.save();

    res.status(204).json({ message: 'All arguments deleted successfully for the debate' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const editArgument = async (req, res) => {
  const { debateId, argumentId } = req.params; 
  const updates = req.body; 
  const allowedUpdates = ['content'];
  const requestedUpdates = Object.keys(updates);

  try {
    if (!mongoose.Types.ObjectId.isValid(debateId)) {
      console.log("Invalid debate ID");
      return res.status(400).json({ message: 'Invalid debate ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(argumentId)) {
      console.log("Invalid argument ID");
      return res.status(400).json({ message: 'Invalid argument ID' });
    }
  
     // Validate that all required fields are present for PUT
 
     const isValidUpdate = requestedUpdates.every(key => allowedUpdates.includes(key));
     if (!isValidUpdate || requestedUpdates.length !== allowedUpdates.length) {
       return res.status(400).json({ message: 'Invalid or incomplete updates' });
     }

    const updatedArgument = await Argument.findByIdAndUpdate(argumentId, updates, { new: true, runValidators: true });

    res.status(200).json({ message: 'Argument updated successfully', argument: updatedArgument });
  } catch (error) {
    // Catch any errors and send a 500 Internal Server Error response
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports = {
  createArgument,
  getAllArguments,
  getArgumentById,
  deleteArgument,
  deleteAllArgumentsOfDebate,
  editArgument
};
