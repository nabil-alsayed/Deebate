// File: ./models/comment.js
// A mongoose model for a comment

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentModel = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentModel);
