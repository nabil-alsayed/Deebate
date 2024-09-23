const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentModel = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    argument: {
      type: Schema.Types.ObjectId,
      ref: 'Argument',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
