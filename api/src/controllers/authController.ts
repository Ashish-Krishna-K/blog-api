import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Author from '../models/authorModel';
import { compare, hash } from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

declare global {
  namespace Express {
    interface User {
      id?: string;
    }
  }
}

const generateToken = (id: string) => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!);
  return {
    accessToken,
    refreshToken,
  };
};

const extractToken = (req: Request): string | undefined => {
  const bearer = req.headers['authorization'];
  if (!bearer) return undefined;
  return bearer.split(' ')[1];
};

export const verifyStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      const admin = await Author.findOne({ email }).exec();
      if (!admin) return done(null, false, { message: 'Email not found' });
      const result = await compare(password, admin.hashedPassword);
      if (!result) return done(null, false, { message: 'Incorrect Password' });
      return done(null, { id: admin.id });
    } catch (error) {
      console.error(error);
      return done(error);
    }
  },
);

export const signUp = [
  body('firstName').trim().notEmpty().withMessage('First Name is required').escape(),
  body('lastName').trim().notEmpty().withMessage('Last Name is required').escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage("Email must be of the format 'you@email.com'")
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must be atleast 6 characters long.')
    .matches(/[a-z]/g)
    .withMessage('Password must contain atleast 1 lowercase letter')
    .matches(/[A-Z]/g)
    .withMessage('Password must contain atleast 1 uppercase letter')
    .matches(/[0-9]/g)
    .withMessage('Password must contain atleast 1 numeric digit')
    .matches(/[`~!@#$%^&*()_\-+=|\\:;"'<,>.?/]/g)
    .withMessage('Password must contain atleast 1 special character')
    .escape(),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Password must be atleast 6 characters long.')
    .matches(/[a-z]/g)
    .withMessage('Password must contain atleast 1 lowercase letter')
    .matches(/[A-Z]/g)
    .withMessage('Password must contain atleast 1 uppercase letter')
    .matches(/[0-9]/g)
    .withMessage('Password must contain atleast 1 numeric digit')
    .matches(/[`~!@#$%^&*()_\-+=|\\:;"'<,>.?/]/g)
    .withMessage('Password must contain atleast 1 special character')
    .custom((value, { req }) => req.body.password === value)
    .withMessage('Passwords do not match')
    .escape(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const formData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    if (!errors.isEmpty()) {
      return res.status(406).json({
        formData,
        errors: errors.array(),
      });
    } else {
      try {
        const hashedPassword = await hash(req.body.password, 16);
        const admin = new Author({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          hashedPassword,
        });
        await admin.save();
        return res.sendStatus(201);
      } catch (error) {
        console.error(error);
        return res.status(500).json(error);
      }
    }
  },
];

export const login = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage("Email must be of the format 'you@email.com'")
    .escape(),
  body('password').trim().notEmpty().withMessage('Password is required').escape(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const formData = {
      email: req.body.email,
      password: req.body.password,
    };
    if (!errors.isEmpty()) {
      return res.status(406).json({
        formData,
        errors: errors.array(),
      });
    }
    passport.authenticate(
      'local',
      {
        session: false,
      },
      async (error: unknown, user: Express.User, info: string) => {
        if (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        if (!user) return res.status(401).json(info);
        const token = generateToken(user.id!);
        try {
          const admin = await Author.findById(user.id).exec();
          if (admin) {
            admin.validToken = token.refreshToken;
            await admin.save();
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json(error);
        }
        return res.json(token);
      },
    )(req, res, next);
  },
];

export const authorizeAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return res.sendStatus(401).json('Token not available');
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, data) => {
    if (error) {
      console.error(error);
      return res.sendStatus(403).json('Token not valid');
    }
    if (data) {
      req.user = typeof data === 'string' ? { id: data } : { id: data.user.id };
    }
    return next();
  });
};

export const authorizeRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return res.sendStatus(401).json('Token not available');
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, async (error, data) => {
    if (error) {
      console.error(error);
      return res.sendStatus(403).json('Token not valid');
    }
    if (data) {
      const userId = typeof data === 'string' ? data : (data.id as string);
      try {
        const admin = await Author.findById(userId).exec();
        if (!admin) return res.status(404).json('User not found.');
        if (admin.validToken !== token) return res.status(403).json('Token is not valid');
        req.user = { id: admin.id };
      } catch (error) {
        console.error(error);
        return res.status(500).json(error);
      }
    }
    return next();
  });
};

export const getToken = [
  authorizeRefreshToken,
  async (req: Request, res: Response) => {
    try {
      const admin = await Author.findById(req.user?.id).exec();
      if (!admin) return res.status(401).json('User not found.');
      const newToken = generateToken(admin.id);
      return res.json(newToken.refreshToken);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];

export const logout = [
  authorizeRefreshToken,
  async (req: Request, res: Response) => {
    try {
      const admin = await Author.findById(req.user?.id).exec();
      if (admin) {
        admin.validToken = '';
        await admin.save();
      }
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];
