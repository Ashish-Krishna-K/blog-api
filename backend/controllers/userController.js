const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

const User = require('../models/userModel');

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    User.findOne({ email: email })
      .select('+password')
      .exec((err, user) => {
        if (err) {
          return done(err);
        };
        if (!user) {
          return done(null, false, { message: "Incorrect Username" });
        };
        bcrypt.compare(password, user.password, (err, result) => {
          if (!result) {
            console.log(result);
            return done(null, false, { message: "Incorrect Password" });
          }
          return done(null, user);
        })
      });
  }
))

exports.signup_post = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username is required")
    .escape(),
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should be of the format you@email.com")
    .normalizeEmail({ gmail_remove_dots: false })
    .custom(value => {
      User.find({ email: value })
        .exec((err, user) => {
          if (err) {
            return err
          };
          if (user) {
            return ("Email already in use")
          };
        });
      return true;
    })
    .withMessage("Email already in use"),
  body("password")
    .isLength({ min: 1 })
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage("Password must contain one number, one Uppecase, one Lowercase and one Symbol with minimum 6 characters."),
  body("confirm_password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        return ("Passwords do not match")
      }
      return true;
    })
    .withMessage('Passwords do not match'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors });
    };
    bcrypt.hash(req.body.password, 16, (err, hashedPswrd) => {
      if (err) {
        return res.status(400).json({
          message: err
        });
      } else {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPswrd,
          is_admin: false,
        });
        newUser.save((err) => {
          if (err) {
            return res.status(400).json({
              message: err,
            });
          } else {
            res.sendStatus(201);
          };
        });
      };
    });
  }
];

exports.login_post = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({
        message: "An Error occured",
      });
    };
    if (!user) {
      return res.status(400).json({
        message: info,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(400).json({
          message: err
        });
      }
      user.password = "hidden"
      const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
}

exports.logout_post = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return res.status(400).json({
        message: err
      });
    } else {
      res.sendStatus(200);
    }
  })
};
