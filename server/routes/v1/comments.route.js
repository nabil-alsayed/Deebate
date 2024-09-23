const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../../controllers/v1/comment.controller');
const methodOverride = require('method-override');

// Apply method-override of a specific comment
router.use('/:commentId', methodOverride('X-HTTP-Method-Override'));

// Comment routes (nested under arguments)
router.post('/', commentController.addComment);  
router.get('/', commentController.getCommentsForArgument);
router.get('/:commentId', commentController.getCommentById);  
router.delete('/:commentId', commentController.deleteComment); 
router.delete('/', commentController.deleteAllComments); 
router.put('/:commentId', commentController.updateComment);
router.patch('/:commentId', commentController.updateComment);

// Like routes
router.post('/:commentId/like', commentController.addLikeToComment); 
router.delete('/:commentId/like', commentController.removeLikeFromComment); 

module.exports = router;
