var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const Debate = require("../models/debate");

// This can be used to generate a verification token for email verification

const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true, // to prevent client side JS from reading the cookie and xss attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // to prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// Middleware to validate token and role
const authenticateRole = (requiredRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: 'Access denied: Token not provided' });
    }

    // Ensure the token is provided in "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res
        .status(401)
        .json({ message: 'Access denied: Malformed authorization header' });
    }

    const token = parts[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied: Token is missing' });
    }

    // Validate the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json({ message: 'Access denied: Token expired' });
        }
        return res
          .status(401)
          .json({ message: 'Access denied: Invalid token' });
      }

      // Check if the user's role is allowed
      const userData = decodedToken;
      if (requiredRoles.includes(userData.role) || userData.role === 'admin') {
        req.user = userData; // Attach decoded token data to the request object
        next(); // Proceed to the next middleware or route handler
      } else {
        return res
          .status(403)
          .json({ message: 'Access forbidden: Insufficient permissions' });
      }
    });
  };
};

// Hash the password with a given salt round
const hashPassword = async (password, saltRounds = 10) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

// Compare plain password with hashed password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

const generatePrompt = async (debate) => {
  let prompt = '';
  const ask = "Analyze the following debate: ";
  const topic = `Topic: ${debate.topic}\n`;
  const rules = `Follow these rules: 
    1) Respectful Language: check if they use offensive, derogatory, or discriminatory language. 
    2) Fact-Checking: do participants provide reliable sources to support their claims? 
    3) Relevance: does the discussion stay on topic and avoid tangents? 
    4) Reasonableness: Discourage arguments based on personal opinions or beliefs without evidence. 
    5) Ethics: Promote ethical considerations to avoid discussions that promote harmful or unethical behaviors. 
    6) Logical Fallacies: Identify and point out logical fallacies in arguments.
    7) Keep the analysis objective and unbiased.
    8) Keep the analysis concise and to the point.
    9) Keep it short and sweet. Don't write an essay.
    `;

  let argumentsString = '';

  // Fetch the participants for better readability
  const participantsArr = debate.participants;

  // Iterate through arguments to build the prompt
  debate.arguments.forEach((argument, index) => {
    const participant = getParticipantName(participantsArr, argument.owner._id || argument.owner);
    const participantDetails = `Debator: ${participant.firstName} ${participant.lastName} (${participant.username})`;
    argumentsString += `Debator: ${participantDetails} | Argument ${index + 1} | Side: ${argument.side}\nContent: ${argument.content}\n\n`;
  });

  // Combine the parts of the prompt
  prompt = ask + topic + rules + argumentsString;
  console.log(prompt);

  return prompt;
};

// Helper function to get participant details
const getParticipantName = (participantsArr, participantId) => {
  const participantObj = {
    firstName: '',
    lastName: '',
    username: '',
  };

  participantsArr.forEach(participant => {
    // Compare the participant ID with the argument owner ID
    if (participant._id.equals(participantId)) {
      participantObj.firstName = participant.firstName;
      participantObj.lastName = participant.lastName;
      participantObj.username = participant.username;
    }
  });

  return participantObj;
};


module.exports = {
  generateVerificationToken,
  generateTokenAndSetCookie,
  authenticateRole,
  hashPassword,
  comparePassword,
  generatePrompt,
};
