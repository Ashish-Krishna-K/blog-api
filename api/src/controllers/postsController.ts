import { Request, Response } from 'express';
import Posts from '../models/postsModel';
import { authorizeAccessToken, extractToken } from './authController';
import { body, validationResult } from 'express-validator';
import Comments from '../models/commentsModel';

export const getAllPosts = async (req: Request, res: Response) => {
  const direction = req.query.d;
  const from = req.query.f?.toString();
  const token = !!extractToken(req);
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
    const posts = await Posts.find(
      token
        ? {
            createdAt: mainQuery,
          }
        : {
            createdAt: mainQuery,
            isPublished: true,
          },
    )
      .sort({ createdAt: sort })
      .limit(5)
      .populate('author', 'firstName lastName')
      .exec();
    if (posts.length < 1) return res.status(404).json(posts);
    const prevQuery =
      direction !== 'prev'
        ? getBackwardQuery(posts[0].createdAt || Date.now().toString())
        : getBackwardQuery(posts[posts.length - 1].createdAt);
    const nextQuery =
      direction !== 'prev' ? getForwardQuery(posts[posts.length - 1].createdAt) : getForwardQuery(posts[0].createdAt);
    const previousCount = await Posts.countDocuments(
      token
        ? {
            createdAt: prevQuery,
          }
        : {
            createdAt: prevQuery,
            isPublished: true,
          },
    ).exec();
    const nextCount = await Posts.countDocuments(
      token
        ? {
            createdAt: nextQuery,
          }
        : {
            createdAt: nextQuery,
            isPublished: true,
          },
    ).exec();
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
    const token = !!extractToken(req);
    const post = await Posts.findById(req.params.postId)
      .populate('author', 'firstName lastName')
      .populate('comments')
      .exec();
    if (!post) return res.sendStatus(404);
    if (!post.isPublished && !token) return res.sendStatus(403);
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
        author: req.user?.id,
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
      try {
        const post = await Posts.findById(req.params.postId).exec();
        if (!post) return res.status(404).json('Post not found');
        post.title = formData.title;
        post.text = formData.text;
        await post.save();
        return res.json(post);
      } catch (error) {
        console.error(error);
        return res.status(500).json(error);
      }
    }
  },
];

export const publishPost = [
  authorizeAccessToken,
  async (req: Request, res: Response) => {
    try {
      const post = await Posts.findById(req.params.postId, 'isPublished').exec();
      if (!post) return res.status(404).json('Post not found');
      post.isPublished = !post.isPublished;
      await post.save();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];

export const deletePost = [
  authorizeAccessToken,
  async (req: Request, res: Response) => {
    try {
      const post = await Posts.findById(req.params.postId).exec();
      if (!post) return res.sendStatus(200);
      await Promise.all(post.comments.map((comment) => Comments.findByIdAndDelete(comment).exec() ?? []));
      await Posts.findByIdAndDelete(req.params.postId).exec();
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];
