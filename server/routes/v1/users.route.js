const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../../controllers/v1/user.controller');
const {authenticateRole} = require("../../utils/utils");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
  }
});

const upload = multer({ storage: storage });

// User routes
router.get('/search', authenticateRole("user"), userController.searchUsers)
router.get('/', authenticateRole("admin"), userController.getAllUsers);
router.delete('/', authenticateRole("admin"), userController.deleteAllUsers);
router.get('/:userId', authenticateRole("user"), userController.getUser);
router.patch('/:userId', authenticateRole("user"), upload.single('profileImg'), userController.editUser);
router.delete('/:userId', authenticateRole("user"), userController.deleteUser);

module.exports = router;
