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
  debates: [{
    type: Schema.Types.ObjectId, 
    ref: "Debate"
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // isVerified: { // we can use this to check if a user has verified their email
  //   type: Boolean,
  //   default: false
  // },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserModel);
