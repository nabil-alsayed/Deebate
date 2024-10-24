const express = require('express');
const router = express.Router();
const upload = require('../../multer-config');
const userController = require('../../controllers/v1/user.controller');

// Route to upload profile picture
router.post('/profile/upload', upload.single('profileImg'), userController.uploadProfileImage);

module.exports = router;
