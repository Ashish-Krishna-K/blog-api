/*
User model needs to have the following:
  username
  email
  password
  confirm password(only on signup form)
  is_admin
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, select: false, required: true },
  is_admin: { type: String, default: false }
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);

