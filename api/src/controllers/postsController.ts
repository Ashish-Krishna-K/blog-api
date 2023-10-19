import { Request, Response } from 'express';
import Posts from '../models/postsModel';
import { authorizeAccessToken } from './authController';
import { body, validationResult } from 'express-validator';

export const getAllPosts = async (req: Request, res: Response) => {
  const direction = req.query.d;
  const from = req.query.f?.toString();
  const getForwardQuery = (from: NativeDate | string | number | undefined) => {
    return {
      $lt: from || Date.now().toString(),
    };
  };
  const getBackwardQuery = (from: NativeDate | string | number | undefined) => {
    return {
      $gt: from || new Date(0).getTime(),
    };
  };
  const mainQuery = direction !== 'prev' ? getForwardQuery(from) : getBackwardQuery(from);
  const sort = direction === 'prev' ? 1 : -1;
  try {
    const posts = await Posts.find({ createdAt: mainQuery })
      .sort({ createdAt: sort })
      .limit(5)
      .populate('author', 'firstName lastName')
      .exec();
    if (posts.length < 1) return res.status(404).json(posts);
    const previousCount = await Posts.countDocuments({
      createdAt:
        direction !== 'prev'
          ? getBackwardQuery(from || Date.now().toString())
          : getBackwardQuery(from),
    }).exec();
    const nextCount = await Posts.countDocuments({
      createdAt: direction !== 'prev' ? getForwardQuery(posts[4].createdAt) : getForwardQuery(posts[0].createdAt),
    }).exec();
    if (sort === 1) posts.reverse();
    const data = {
      previousCount,
      nextCount,
      posts,
    };
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const post = await Posts.findById(req.params.postId)
      .populate('author', 'firstName lastName')
      .populate('comments')
      .exec();
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
      const post = await Posts.findById(req.params.postId)
        .populate('author', 'firstName lastName')
        .populate('comments')
        .exec();
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
