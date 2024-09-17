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
    data: Buffer,
    type: String 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  debates: [{
    type: Schema.Types.ObjectId, 
    ref: "Debate"
  }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserModel);