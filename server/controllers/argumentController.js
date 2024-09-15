const Argument = require('../models/argument');

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
module.exports = { createArgument };
