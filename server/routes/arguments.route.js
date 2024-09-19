const express = require('express');
const router = express.Router();
const argumentController = require('../controllers/argument.controller');

app.post('/', argumentController.createArgument);
app.get('/', getAllArguments);
app.get('/:id', getArgumentById);
app.delete('/:id', deleteArgument);

module.exports = router;
