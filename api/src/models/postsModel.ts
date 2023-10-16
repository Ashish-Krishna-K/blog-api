import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostsSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  },
  {
    timestamps: true,
  },
);

PostsSchema.index({ updatedAt: -1 });

const Posts = mongoose.model('Posts', PostsSchema);

export default Posts;
