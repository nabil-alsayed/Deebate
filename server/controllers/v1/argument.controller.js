const mongoose = require('mongoose');
const Debate = require('../../models/debate');
const Argument = require('../../models/argument');
const Comment = require('../../models/comment');

// Create a new argument
const createArgument =  async (req, res, next) => {
  // TODO: check if the argument user is one of the two debaters, and if the debate is still open
  // if the owner is not one of the debaters, return 403 Forbidden
  // if the debate is closed, return 403 Forbidden

  const { debateId } = req.params;
  const { content, owner } = req.body;

  try {
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }

    // Create a new argument (assuming you have an Argument model)
    const argument = new Argument({
      content,
      owner: owner,
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

    const arguments = await Argument.find({ debate });

    res.status(200).json(arguments);
  } catch (err) {
    return next(err);
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
      .status(200)
      .json({ message: 'Argument and associated comments deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createArgument,
  getAllArguments,
  getArgumentById,
  deleteArgument,
};
