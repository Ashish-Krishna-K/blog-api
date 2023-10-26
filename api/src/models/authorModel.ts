import mongoose, { InferSchemaType } from 'mongoose';

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

AuthorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

interface AuthorModel extends InferSchemaType<typeof AuthorSchema> {
  fullName: string;
}

const Author = mongoose.model<AuthorModel>('Author', AuthorSchema);

export default Author;
