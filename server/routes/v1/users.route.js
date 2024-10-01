const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/user.controller');
const {authenticateRole} = require("../../utils/utils");

// User routes
router.get('/', authenticateRole("admin"), userController.getAllUsers);
router.delete('/', authenticateRole("admin"), userController.deleteAllUsers);
router.get('/:userId', authenticateRole("user"), userController.getUser);
router.patch('/:userId', authenticateRole("user"), userController.editUser);
router.delete('/:userId', authenticateRole("user"), userController.deleteUser);

module.exports = router;
