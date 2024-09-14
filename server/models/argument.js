// File: ./models/argument.js
// A mongoose model for an argument

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArgumentModel = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Argument', ArgumentModel);
