import mongoose, { InferSchemaType } from 'mongoose';

const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

PostsSchema.virtual('url').get(function () {
  return `/api/posts/${this.id}`;
});

interface PostsModel extends InferSchemaType<typeof PostsSchema> {
  url: string;
}

const Posts = mongoose.model<PostsModel>('Posts', PostsSchema);

export default Posts;
