const Argument = require('../models/argument');
//const Comment = require('../models/comment');

// Create a new argument
const createArgument = async (req, res) => {
  try {
    const { content, owner } = req.body;
    if (!content) {
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

// Get all arguments
const getAllArguments = async (req, res) => {
  try {
    const arguments = await Argument.find().populate('comments');
    res.status(200).json(arguments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TO-DO: Delete specific argument by ID

module.exports = {
  createArgument,
  getArgumentById,
  getAllArguments,
};
