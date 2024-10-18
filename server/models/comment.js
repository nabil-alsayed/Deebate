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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentModel);
