const express = require('express');
const router = express.Router();
const argumentController = require('../controllers/v1/argument.controller');
const commentRoutes = require('../routes/comments.route');

router.post('/', argumentController.createArgument);
router.get('/', argumentController.getAllArguments);
router.get('/:id', argumentController.getArgumentById);
router.delete('/:id', argumentController.deleteArgument);

router.post('/comments', commentRoutes);
module.exports = router;
