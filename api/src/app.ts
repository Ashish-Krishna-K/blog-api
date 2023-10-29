import 'dotenv/config.js';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
import compression from "compression";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import apiRouter from './routes/apiRoutes.js';
import mongoose from 'mongoose';
import passport from 'passport';
import { verifyStrategy } from './controllers/authController.js';

const app = express();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('connectedToDB');
  } catch (error) {
    console.error(error);
  }
};

connectToDb();
passport.use(verifyStrategy);
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

app.use(helmet());
app.use(limiter);
app.use(passport.initialize());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

module.exports = app;
