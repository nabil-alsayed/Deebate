const Comment = require('../../models/comment');
const Argument = require('../../models/argument');

// Add a comment to a specific argument
const addComment = async (req, res) => {
  const { argumentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const argument = await Argument.findById(argumentId);
    if (!argument) {
      return res.status(404).json({ error: 'Argument not found' });
    }

    const newComment = new Comment({ content });
    const savedComment = await newComment.save();

    // Add the comment to the argument's comments array
    argument.comments.push(savedComment._id);
    await argument.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all comments for a specific argument
const getCommentsForArgument = async (req, res) => {
  const { argumentId } = req.params;

  try {
    const argument = await Argument.findById(argumentId).populate('comments');
    if (!argument) {
      return res.status(404).json({ error: 'Argument not found' });
    }
    res.status(200).json(argument.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific comment by ID
const getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific comment by ID
const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    // TODO: Check ownership

    // Remove the comment from the argument's comments array
    await Argument.updateMany({ comments: id }, { $pull: { comments: id } });

    // Delete the comment
    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add like to a comment
const addLikeToComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove like from a comment
const removeLikeFromComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsForArgument,
  getCommentById,
  deleteComment,
  addLikeToComment,
  removeLikeFromComment,
};
