const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET
  },
  (jwtPayload, done) => {
    return done(null, jwtPayload);
  }
));

exports.get_comment_list = (req, res, next) => {

};

exports.get_comment = (req, res, next) => {

};

exports.create_comment = [
  body("author")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .escape(),
  body("comment_content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment field can't be empty!")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    };
    const newComment = new Comment({
      created_by: req.body.author,
      time_stamp: Date.now(),
      comment_content: req.body.comment_content,
      parent_post: req.params.postId
    });
    newComment.save((err, commentDoc) => {
      if (err) return res.send(err);
      Post.findById(req.params.postId, (err, post) => {
        post.comments.push(commentDoc._id);
        post.save((err) => {
          if (err) return res.send(err);
        });
      });
      return res.sendStatus(201)
    })
  }
]

exports.delete_comment = (req, res, next) => {

}
