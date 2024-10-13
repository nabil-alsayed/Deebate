/* This controller is for managing the User Endpoints */

const User = require('../../models/user');
const mongoose = require('mongoose');
const { authenticateRole, hashPassword } = require("../../utils/utils");

// Search for user

const searchUsers = async (req, res) => {
  const { search, limit } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Please provide a search query' });
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { emailAddress: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ]
    }).limit(Number(limit) || 5);

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found.' });
    }

    return res.status(200).json({ message: 'Users found', users });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


// Get all users

const getAllUsers = async (req, res) => {

  try {
    const users = await User.find();

    if (users.length < 1) {
      res.status(401).json({ error: 'No registred users found.' });
    }

    // Return a 200 response with list of users
    res.status(200).json({ message: 'Registred users were found: ', users });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error.', error: error.message });
  }
};

// Get a specific user

const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the ID provided is a valid mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid ID format');
      return res
          .status(400)
          .json({ message: `ID format provided is invalid: ${userId}` });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found, return a 404 response
    if (!user) {
      return res
          .status(404)
          .json({ message: `User with ID: ${userId} cannot be found.` });
    }

    // Return a 200 response with the user data
    return res
        .status(200)
        .json({ message: `Successfully found user with ID ${userId}`, user });
  } catch (error) {
    res
        .status(500)
        .json({ message: 'Internal Server Error.', error: error.message });
  }
};

// Modify one user's info

const editUser = async (req, res) => {
  const updates = req.body;  // Get the updates from request body
  const { userId } = req.params;

  // Ensure we only update fields that are allowed
  const allowedAttributes = ['emailAddress', 'username', 'password', 'firstName', 'lastName', 'profileImg'];

  // Check if the update request contains only allowed attributes
  const isValidRequest = Object.keys(updates).every((key) => allowedAttributes.includes(key));

  if (!isValidRequest) {
    return res.status(400).json({ message: 'Invalid update request. Some attributes are not allowed.' });
  }

  // Hash the password if provided
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if another user with the same email or username exists (excluding current user)
    const existingUser = await User.findOne({
      _id: { $ne: userId },  // Exclude current user from search
      $or: [{ emailAddress: updates.emailAddress }, { username: updates.username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).lean();

    // Don't return the password in the response
    delete updatedUser.password;

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const { id } = req.user;

  const requestedUserId = userId;
  const requestingUserId = id;

  try {

    // if the user is not the owner or an admin, return a 403 response
    if (requestedUserId !== requestingUserId) {
      try {
        await authenticateRole('admin');
      } catch (error) {
        return res.status(403).json({ message: error.message });
      }
    }

    // Find the user by its ID
    const user = await User.findById(requestedUserId);

    // check if the user exist
    if (!user) {
      return res.status(404).json({ message: 'User was not found.' });
    }
    // find the user and update the informations as per the request
    const deletedUser = await User.findByIdAndDelete(userId);

    res
      .status(204)
      .json({
        message: `${user.username}'s was deleted sucessfully!`,
        deletedUser,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error.', error: error.message });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      return res.status(400).json({ message: 'This endpoint is only available in test environment' });
    }

    await User.deleteMany();
    res.status(204).json({ message: 'All users deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  searchUsers,
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  deleteAllUsers
};
