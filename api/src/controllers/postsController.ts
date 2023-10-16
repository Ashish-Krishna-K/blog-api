import { Request, Response } from 'express';
import Posts from '../models/postsModel';
import { authorizeAccessToken } from './authController';
import { body, validationResult } from 'express-validator';

export const getAllPosts = async (req: Request, res: Response) => {
  const direction = req.query.d;
  const from = req.query.f;
  const query = direction === 'next' ? { $lt: from || Date.now().toString() } : { $gt: from || new Date(0).getTime() };
  const sort = direction === 'next' ? -1 : 1;
  try {
    const posts = await Posts.find({ createdAt: query }).sort({ createdAt: sort }).limit(5).exec();
    if (posts.length < 1) return res.status(404).json(posts);
    if (sort === 1) posts.reverse();
    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const post = await Posts.findById(req.params.postId).populate('comments').exec();
    if (!post) return res.sendStatus(404);
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const createNewPost = [
  authorizeAccessToken,
  body('title').trim().notEmpty().withMessage('Title is required').escape(),
  body('text').trim().notEmpty().withMessage('Text is required').escape(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const formData = {
      title: req.body.title,
      text: req.body.text,
    };
    if (!errors.isEmpty()) {
      return res.status(406).json({
        formData,
        errors: errors.array(),
      });
    } else {
      const post = new Posts({
        title: formData.title,
        text: formData.text,
        author: req.user,
      });
      try {
        await post.save();
        return res.status(201).json(post);
      } catch (error) {
        console.error(error);
        return res.status(500).json(error);
      }
    }
  },
];

export const editPost = [
  authorizeAccessToken,
  body('title').trim().notEmpty().withMessage('Title is required').escape(),
  body('text').trim().notEmpty().withMessage('Text is required').escape(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const formData = {
      title: req.body.title,
      text: req.body.text,
    };
    if (!errors.isEmpty()) {
      return res.status(406).json({
        formData,
        errors: errors.array(),
      });
    } else {
      const post = await Posts.findById(req.params.postId).populate('comments').exec();
      if (!post) return res.status(404).json('Post not found');
      post.title = formData.title;
      post.text = formData.text;
      try {
        await post.save();
        return res.json(post);
      } catch (error) {
        console.error(error);
        return res.status(500).json(error);
      }
    }
  },
];

export const deletePost = [
  authorizeAccessToken,
  async (req: Request, res: Response) => {
    try {
      await Posts.findByIdAndDelete(req.params.postId).exec();
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];
