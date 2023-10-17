import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
    createdOn: { type: Date, default: Date.now, immutable: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Comments = mongoose.model('Comments', CommentsSchema);

export default Comments;
