const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Debate Schema
const debateSchema = new Schema({
  topic: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing spaces
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'locked'],
    default: 'open',
  },
  timeStamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,  // Debate must have an end time to be locked
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the user who initiated the debate
    required: true,
  },
  arguments: [{
    type: Schema.Types.ObjectId,
    ref: 'Argument',
    required: true,
  }]
  //in case a user create an argument for with 2 other debators
//   participants: [{
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//   }]
});

const Debate = mongoose.model('Debate', debateSchema);