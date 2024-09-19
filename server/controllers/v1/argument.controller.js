const mongoose = require('mongoose');
const Debate = require('../../models/debate');
const Argument = require('../../models/argument');
const Comment = require('../../models/comment');

// Create a new argument
const createArgument = async (req, res) => {
  try {
    const { content, owner } = req.body;
    if (!content || !owner) {
      // TODO: validate !owner and that he is logged in
      return res.status(400).json({ error: `Content and owner are required` });
    }
    const newArgument = new Argument({ content, owner });
    const savedArgument = await newArgument.save();
    res.status(201).json(savedArgument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all arguments
const getAllArguments = async (req, res) => {
  try {
    const arguments = await Argument.find().populate('comments');
    res.status(200).json(arguments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific argument by ID
const getArgumentById = async (req, res) => {
  const { id } = req.params;
  try {
    const argument = await Argument.findById(id).populate('comments');
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
  const { id } = req.params;
  try {
    const argument = await Argument.findById(id);
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

module.exports = { getAllArguments, getArgumentById, deleteArgument };
