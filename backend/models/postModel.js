/*
Post model needs to have the following:
  created_by_name
  created_at(not shown to user/only shown to creator)
  published_at
  title
  content
  comments(stored as array of comment references in db)
  published(boolean/only accessed by creator/if set to true show in client website)
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  written_by: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now() },
  published_at: { type: Date, default: Date.now() },
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  is_published: { type: Boolean, default: false },
});

PostSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);