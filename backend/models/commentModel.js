/* 
Comment model should have the following:
  created_by
  time_stamp
  comment_content
  parent_post
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  created_by: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now() },
  comment_content: { type: String, required: true },
  parent_post: { type: Schema.Types.ObjectId, ref: "Post" }
});

CommentSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("Comment", CommentSchema);