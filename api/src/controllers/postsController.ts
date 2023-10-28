import type { Request, Response } from 'express';
import Posts from '../models/postsModel';
import { authorizeAccessToken, extractToken } from './authController';
import { body, validationResult } from 'express-validator';
import Comments from '../models/commentsModel';

// Get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  const direction = req.query.d;
  const from = req.query.f?.toString();
  // get a boolen based on token exists or not in the request object.
  const token = !!extractToken(req);
  const getForwardQuery = (from: NativeDate | string | number | undefined) => {
    // A function to return a query filter for forward direction(in descending order
    // of created timestamp which is equivalent to latest first)
    return {
      $lt: from || Date.now().toString(),
    };
  };
  const getBackwardQuery = (from: NativeDate | string | number | undefined) => {
    // A function to return a query filter for reverse direction(in ascending order
    // of created timestamp which is equivalent to oldest first)
    return {
      $gt: from || new Date(0).getTime(),
    };
  };
  // when direction is not previous, we need to get the posts which is older than the cursor,
  // if it is previous, we need to get the posts newer than the cursor
  const mainQuery = direction !== 'prev' ? getForwardQuery(from) : getBackwardQuery(from);
  const sort = direction === 'prev' ? 1 : -1;
  try {
    const posts = await Posts.find(
      // if token exists, request is coming from CMS so filter all the posts,
      // if token doesn't exist, request is coming from client so filter only
      // published posts
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
    // no posts matching the query is found
    if (posts.length < 1) return res.status(404).json(posts);
    // create a query to get the count of posts previous to the cursor post
    const prevQuery =
      // previous count refers to the count of posts which is more recent than the cursor
      // when direction is previous, the results will be in ascending order where in the last
      // item in the result will be the most recent, hence using that as the cursor for prev direction.
      direction !== 'prev'
        ? getBackwardQuery(posts[0].createdAt || Date.now().toString())
        : getBackwardQuery(posts[posts.length - 1].createdAt);
    const nextQuery =
      // next count refers to the count of posts which is older than the cursor, when direction is not
      // previous, the results will be in descending order where in the first item in the result will be
      // the most recent, hence using it as the cursor for prev direction.
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
    // reverse the results when direction is prev, so the data sent will retain the
    // descending order
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

// Get single post
export const getSinglePost = async (req: Request, res: Response) => {
  try {
    // get a boolen based on token exists or not in the request object.
    const token = !!extractToken(req);
    const post = await Posts.findById(req.params.postId)
      .populate('author', 'firstName lastName')
      .populate('comments')
      .exec();
    if (!post) return res.sendStatus(404);
    // request coming from client and post is not published so requestor
    // is not allowed to view the post.
    if (!post.isPublished && !token) return res.sendStatus(403);
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// Create new post
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

// Edit a post
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

// Publish/Unpublish post
export const publishPost = [
  authorizeAccessToken,
  async (req: Request, res: Response) => {
    try {
      const post = await Posts.findById(req.body.postId, 'isPublished').exec();
      if (!post) return res.status(404).json('Post not found');
      post.isPublished = !post.isPublished;
      // Ensuring last updated timestamp is not modified.
      await post.save({ timestamps: false });
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];

// Delete a post
export const deletePost = [
  authorizeAccessToken,
  async (req: Request, res: Response) => {
    try {
      const post = await Posts.findById(req.params.postId).exec();
      if (!post) return res.sendStatus(200);
      // Delete all the comments related to the post
      await Promise.all(post.comments.map((comment) => Comments.findByIdAndDelete(comment).exec()));
      await Posts.findByIdAndDelete(req.params.postId).exec();
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];
