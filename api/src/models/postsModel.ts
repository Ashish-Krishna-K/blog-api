import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostsSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    isPublished: { type: Boolean, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PostsSchema.index({ createdAt: -1, updatedAt: -1 });

const Posts = mongoose.model('Posts', PostsSchema);

export default Posts;
