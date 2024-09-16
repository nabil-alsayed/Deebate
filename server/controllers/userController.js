/* This controller is for managing the User Endpoints */

const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register a user

const registerUser = async (req, res) => {
    try {

    // Destructure the request body
    const { emailAddress, username, password, firstName, lastName, role } = req.body;

    // Check if user with similar email already exists
    const user = await User.findOne({ emailAddress });

    if(user){
      return res.status(400).json({ message: 'A user with same email exist.'})
    }

    // Check if all required credentials are provided
      if (!emailAddress || !username || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
    // Hash the password annd salt round it to 10
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    // Create document in db for a new user with requested values
      const newUser = await User.create({
        emailAddress,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "user"
      });

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


// Log in a user

const loginUser = async (req, res) => {
  try {
    // Destructure the request body
    const { emailAddress, password } = req.body;

    
    // Check if credentials are provided correctly
    if (!emailAddress || !password) {
      return res.status(400).json({ message: 'Both email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ emailAddress });

    // Check if user is not found or password does not match
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Use bcrypt to compare the plain password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ message: 'Request to login user failed.', error: error.message });
  }
};

// Get all users

const getAllUsers = async (req, res) => {
    try {
      // Destructure the request body
      const { emailAddress, password } = req.body;
  
      
      // Check if credentials are provided correctly
      if (!emailAddress || !password) {
        return res.status(400).json({ message: 'Both email and password are required.' });
      }
  
      // Find user by email
      const user = await User.findOne({ emailAddress, role: 'admin' });
  
      // Check if user is not found or password does not match
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials or admin was not found.' });
      }
  
      // Use bcrypt to compare the plain password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const users = await User.find();
      
      if(users.length < 1) {
        res.status(401).json({ error: 'No registred users found.' })
      }

      res.status(200).json({ message: 'Registred users were found: ', users });
    } catch (error) {
      res.status(500).json({ message: 'Request to get all registred users failed.', error: error.message });
    }
  };


  // Get a specific user
  // TODO: Check the role of the requesting client weither it is Admin or not

  const getUser = async (req, res) => {
    const { id } = req.params;
    try {
  
      // Check if the id provided is valid mongoose id
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ID format');
        return res.status(400).json({ message: `ID format provided is invalid: ${id}` });
      }
  
      // Find the user by its ID
      const user = await User.findById(id);
  
      // If the user is not found, return a 404 response
      if (!user) {
        return res.status(404).json({ message: `User with ID: ${id} cannot be found.` });
      }
  
      // If the user is found, return a 200 response with the user data
      return res.status(200).json({ message: `Successfully found user with ID ${id}`, user });
  
    } catch (error) {
      res.status(500).json({ message: `Request to get user with ID ${id} failed.`, error: error.message });
    }
  };
  

module.exports = { registerUser, loginUser, getAllUsers, getUser };