import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    validToken: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Author = mongoose.model('Author', AuthorSchema);

export default Author;
