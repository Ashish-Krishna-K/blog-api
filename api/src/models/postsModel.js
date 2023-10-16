'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var mongoose_1 = require('mongoose');
var Schema = mongoose_1.default.Schema;
var PostsSchema = new Schema(
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
var Posts = mongoose_1.default.model('Posts', PostsSchema);
exports.default = Posts;
