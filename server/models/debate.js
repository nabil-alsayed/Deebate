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
  category: {
    type: String,
    enum: [
      'Politics',
      'Technology',
      'Sports',
      'Health',
      'Education',
      'Social Issues',
    ], // Add more categories as needed
    required: true,
  },
  endTime: {
    type: Date,
    required: true, // Debate must have an end time to be locked
  },
  owner: {
    type: Schema.Types.String,
    ref: 'User', // Reference to the user who initiated the debate
    required: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: {
    type: Number,
    default: 2, // Default set to 2 participants
    max: 4, // Maximum number of participants
    min: 2, // Minimum number of participants
    required: true,
  },
  arguments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Argument',
    },
    { timestamps: true },
  ],
});

const Debate = mongoose.model('Debate', debateSchema);
module.exports = Debate;
