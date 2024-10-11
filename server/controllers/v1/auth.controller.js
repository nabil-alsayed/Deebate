/* This controller is for managing the Authentication Endpoints */

const User = require('../../models/user')
const bcrypt = require('bcryptjs');
const utils = require('../../utils/utils');

// Register a user

const signup = async (req, res) => {
    // Destructure the request body
    const { emailAddress, username, password, firstName, lastName, role, invitationCode } = req.body;
    try {
     
    // Check if all required credentials are provided
    if (!emailAddress || !username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required.' });
    }

    if (role === 'admin' && invitationCode !== process.env.INVITATION_CODE) {
        return res.status(403).json({ message: 'Invalid invitation code.' });
    }

    // Check if user with similar email or username already exists
    const user = await User.findOne({ $or: [{ emailAddress }, { username }] });

    if(user){
        return res.status(400).json({ message: "A user with same email or username already exist."})
    }
  
    // Hash the password and salt round it to 10
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const verificationToken = utils.generateVerificationToken();
  
    // Create document in db for a new user with requested values
      const newUser = await User.create({
        emailAddress,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "user",
        invitationCode: invitationCode || "none",
        verificationToken,
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 1 day,
      });

      utils.generateTokenAndSetCookie(res, newUser);
  
      // Return a success message and the new registeration record of the user
      res.status(201).json({ 
        message: `${role} registered successfully`,
        user: {...newUser._doc, password: null},
       });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  
  // Log in a user
  
  const login = async (req, res) => {
    
    // Destructure the request body
    const { emailAddress, password } = req.body;
    try {
  
    
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
  
      // Generate a token and set cookie
    const token = utils.generateTokenAndSetCookie(res, user);  // Ensure you return the token here

      user.lastLogin = Date.now();
      await user.save();
  
      // Return a success message and token to login
      res.status(201).json({ message: 'Login successful', token, user: {...user._doc, password: null} });
    } catch (error) {
      console.error('Error during login:', error); // Log error to help identify the issue
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

  const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  };


module.exports = { signup, login, logout };