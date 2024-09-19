const express = require('express');
const router = express.Router();
const commentController = require('../controllers/v1/comment.controller');

//router.post('/:argument_Id/comments', commentController.addComment);
router.post('/', commentController.addComment);
//router.get('/:argument_Id/comments', commentController.getCommentsForArgument);
router.get('/', commentController.getCommentsForArgument);
router.get('/:id', commentController.getCommentById);
router.delete('/:id', commentController.deleteComment);

// Like routes
//router.post('/:comment_id/like', commentController.addLikeToComment);
//router.delete('/:comment_id/like', commentController.removeLikeFromComment);
router.post('/like', commentController.addLikeToComment);
router.delete('/like', commentController.removeLikeFromComment);

module.exports = router;
