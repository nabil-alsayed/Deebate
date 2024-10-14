const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArgumentModel = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
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
    debate: {
      type: Schema.Types.ObjectId,
      ref: 'Debate',
      required: true,
    },
    side: {
      type: String,
      enum: ['with', 'against'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Argument', ArgumentModel);
