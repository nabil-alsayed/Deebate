const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema({
  emailAddress: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  profileImg: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  invitationCode: {
    type: String,
    default: "none"
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserModel);
