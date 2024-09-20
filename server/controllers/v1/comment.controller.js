const Debate = require('../../models/debate');
const Argument = require('../../models/argument');
const Comment = require('../../models/comment');

// Add a comment to a specific argument
const addComment = async (req, res) => {
  const { debateId, argumentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {

    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

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
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
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
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    // TODO: Check ownership

    // Remove the comment from the argument's comments array
    await Argument.updateMany({ comments: commentId }, { $pull: { comments: commentId } });

    // Delete the comment
    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const editComment = async (req, res) => {
 // Get the user's id and updates from the request params and body
 const { debateId, argumentId, commentId } = req.params;
 const updates = req.body;

 // List of allowed attributes to update
 const allowedAttributes = [
   'content'
 ];

 // Check every requested update if it is valid
 const isValidRequest = Object.keys(updates).every((key) =>
   allowedAttributes.includes(key)
 );

 if (!isValidRequest) {
   return res
     .status(400)
     .json({
       message:
         'Invalid update request. One or more attributes are not allowed.',
     });
 }

 try {
   // find the comment
   const comment = await Comment.findById(commentId);
   console.log(comment);

   // check if the user exist
   if (!comment) {
     return res.status(404).json({ message: 'Comment was not found.' });
   }
   // find the user and update the informations as per the request
   const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, {
     new: true,
   });

   res
     .status(200)
     .json({
       message: "Comment Updated Successfully",
       updatedComment,
     });
 } catch (error) {
   res
     .status(500)
     .json({ message: 'Internal Server Error.', error: error.message });
 }
};

// Add like to a comment
const addLikeToComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
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
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
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
  editComment,
  addLikeToComment,
  removeLikeFromComment,
};
