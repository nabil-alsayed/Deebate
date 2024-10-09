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
    ],
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  owner: {
    type: Schema.Types.String,
    ref: 'User',
    required: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: {
    type: Number,
    default: 2,
    max: 4,
    min: 2,
    required: true,
  },
  arguments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Argument',
    },
    { timestamps: true },
  ],
    votesWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    votesAgainst: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Debate = mongoose.model('Debate', debateSchema);
module.exports = Debate;
