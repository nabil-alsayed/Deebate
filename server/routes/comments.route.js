const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

app.post('/:argument_Id/comments', addComment);
app.get('/:argument_Id/comments', getCommentsForArgument);
app.get('/:id', getCommentById);
app.delete('/:id', deleteComment);

// Like routes
app.post('/:comment_id/like', addLikeToComment);
app.delete('/:comment_id/like', removeLikeFromComment);

//router.post('/:debate_id/arguments', debateController.addArgumentToDebate);

module.exports = router;
