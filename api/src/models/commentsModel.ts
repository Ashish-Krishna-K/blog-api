import mongoose, { InferSchemaType } from 'mongoose';

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

CommentsSchema.virtual('url').get(function () {
  return `/api/comments/${this.id}`;
});

interface CommentsModel extends InferSchemaType<typeof CommentsSchema> {
  url: string;
}

const Comments = mongoose.model<CommentsModel>('Comments', CommentsSchema);

export default Comments;
