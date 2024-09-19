const express = require('express');
const router = express.Router();
const argumentController = require('../controllers/v1/argument.controller');

router.post('/', argumentController.createArgument);
router.get('/', argumentController.getAllArguments);
router.get('/:id', argumentController.getArgumentById);
router.delete('/:id', argumentController.deleteArgument);

module.exports = router;
