const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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

exports.get_posts_list = (req, res, next) => {

};

exports.get_single_post = (req, res, next) => {

};

exports.create_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    };
    const newPost = new Post({
      written_by: req.body.authorId,
      created_at: Date.now(),
      published_at: Date.now(),
      title: req.body.title,
      content: req.body.content,
      comments: [],
      is_published: false
    });
    newPost.save((err) => {
      if (err) {
        res.send(err)
      } else {
        res.status(201).json(newPost)
      }
    })
  }
]

exports.edit_post = (req, res, next) => {

};

exports.delete_post = (req, res, next) => {

};

exports.publish_post = (req, res, next) => {

};

exports.unpublish_post = (req, res, next) => {

};