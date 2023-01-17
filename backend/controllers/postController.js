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
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) {
      Post.find({})
        .sort({ created_at: -1 })
        .exec((err, postsList) => {
          if (err) return res.send(err);
          return res.json(postsList);
        })
    } else {
      const requestFrom = req.originalUrl;
      if (!requestFrom.match(/\/user/)) {
        Post.find({ is_published: true })
          .sort({ published_at: -1 })
          .exec((err, postsList) => {
            if (err) {
              return res.send(err);
            }
            if (postsList.length === 0) {
              return res.status(404).json("No posts available at this moment.")
            }
            return res.json(postsList);
          })
      } else {
        res.sendStatus(401);
      }

    }
  })(req, res, next)
}

exports.get_single_post = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return res.send(err);
    Post.findById(req.params.postId)
      .populate("comments")
      .exec((err, result) => {
        if (err) {
          return res.send(err);
        }
        if (!result) {
          return res.sendStatus(404);
        }
        if (!result.is_published && !user) {
          return res.sendStatus(401)
        }
        return res.json(result);
      })
  })(req, res, next);
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

exports.edit_post = [
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
    console.log('here');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    };
    Post.findById(req.params.postId, (err, post) => {
      if (err) {
        return res.send(err);
      };
      post.title = req.body.title;
      post.content = req.body.content;
      post.save((err, updatedPost) => {
        if (err) {
          return res.send(err);
        };
        return res.json(updatedPost);
      })
    })
  }
]

exports.delete_post = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Post.findById(req.params.postId, (err, post) => {
      if (err) return res.send(err);
      if (post.comments.length !== 0) {
        post.comments.forEach(comment => {
          //TODO implement delete comments feature
        })
      };
      Post.findByIdAndRemove(req.params.postId, (err) => {
        if (err) return res.send(err);
        res.sendStatus(204);
      })
    })
  }
]

exports.publish_post = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Post.findById(req.params.postId, (err, post) => {
      if (err) {
        return res.send(err);
      };
      post.is_published = true;
      post.published_at = Date.now();
      post.save((err, updatedPost) => {
        if (err) {
          return res.send(err);
        };
        return res.json(updatedPost);
      });
    });
  }
];

exports.unpublish_post = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Post.findById(req.params.postId, (err, post) => {
      if (err) {
        return res.send(err);
      };
      post.is_published = false;
      post.save((err, updatedPost) => {
        if (err) {
          return res.send(err);
        };
        return res.json(updatedPost);
      });
    });
  }
];