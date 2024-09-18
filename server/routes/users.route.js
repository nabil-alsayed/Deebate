const express = require('express');
const router = express.Router();
const userController = require('../controllers/v1/user.controller');

// User routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.editUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
