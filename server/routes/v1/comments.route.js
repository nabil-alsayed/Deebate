const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../../controllers/v1/comment.controller');
const methodOverride = require('method-override');
const {authenticateRole} = require("../../utils/utils");

// Apply method-override of a specific comment
router.use('/:commentId', methodOverride('X-HTTP-Method-Override'), authenticateRole("user"));

// Comment routes (nested under arguments)
router.post('/', authenticateRole("user"), commentController.addComment);
router.get('/', commentController.getCommentsForArgument);
router.get('/:commentId', commentController.getCommentById);  
router.delete('/:commentId', authenticateRole("user"), commentController.deleteComment);
router.delete('/', authenticateRole("user"), commentController.deleteAllComments);
router.put('/:commentId', authenticateRole("user"), commentController.updateComment);
router.patch('/:commentId', authenticateRole("user"), commentController.updateComment);

// Like routes
router.post('/:commentId/like', authenticateRole("user"), commentController.addLikeToComment);
router.delete('/:commentId/like', authenticateRole("user"), commentController.removeLikeFromComment);

module.exports = router;
