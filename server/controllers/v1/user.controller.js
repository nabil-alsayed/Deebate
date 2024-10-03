/* This controller is for managing the User Endpoints */

const User = require('../../models/user');
const mongoose = require('mongoose');
const {authenticateRole} = require("../../utils/utils");

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

  try {
    // Check if the id provided is valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid ID format');
      return res
        .status(400)
        .json({ message: `ID format provided is invalid: ${userId}` });
    }

    // Find the user by its ID
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
  // Get the requesting user's id and the requested user's id and updates from the request params and body
  const updates = req.body;
  const { userId } = req.params;
  const { id } = req.user;

  const requestedUserId = userId;
  const requestingUserId = id;

  // if the user is not the owner or an admin, return a 403 response
  if (requestedUserId !== requestingUserId) {
    try {
      await authenticateRole('admin');
    } catch (error) {
      return res.status(403).json({ message: error.message });
    }
  }

  // List of allowed attributes to update
  const allowedAttributes = [
    'emailAddress',
    'username',
    'password',
    'firstName',
    'lastName',
    'role',
    'profileImg',
  ];

  // Check every requested update if it is valid
  const isValidRequest = Object.keys(updates).every((key) =>
    allowedAttributes.includes(key)
  );

  if (!isValidRequest) {
    return res
      .status(400)
      .json({
        message:
          'Invalid update request. One or more attributes are not allowed.',
      });
  }

  try {

    // find the user
    const user = await User.findById(userId);

    // check if the user exist
    if (!user) {
      return res.status(404).json({ message: 'User was not found.' });
    }
    // find the user and update the informations as per the request
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    res
      .status(200)
      .json({
        message: `${user.username}'s information updated sucessfully!`,
        updatedUser,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error.', error: error.message });
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
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  deleteAllUsers
};
