const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/user.controller');

// User routes
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUser);
router.patch('/:userId', userController.editUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
