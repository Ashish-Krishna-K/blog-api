'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var mongoose_1 = require('mongoose');
var Schema = mongoose_1.default.Schema;
var CommentsSchema = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  createdOn: { type: Date, default: Date.now, immutable: true },
});
var Comments = mongoose_1.default.model('Comments', CommentsSchema);
exports.default = Comments;
