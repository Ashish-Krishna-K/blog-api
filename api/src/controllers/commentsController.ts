import type { Request, Response } from 'express';
import Posts from '../models/postsModel';
import Comments from '../models/commentsModel';
import { body, validationResult } from 'express-validator';
import { authorizeAccessToken } from './authController';

// Create new comment
export const createComment = [
  body('text').trim().notEmpty().withMessage('Comment is required').escape(),
  body('author').trim().notEmpty().withMessage('Display name is required').escape(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const formData = {
      text: req.body.text,
      author: req.body.author,
    };
    if (!errors.isEmpty()) {
      res.status(406).json({
        formData,
        errors: errors.array(),
      });
    } else {
      const comment = new Comments({
        text: formData.text,
        author: formData.author,
      });
      try {
        const post = await Posts.findById(req.params.postId).exec();
        if (!post) return res.status(404).json('Post not found');
        await comment.save();
        post.comments.push(comment._id);
        // Ensuring updatedAt timestamp is not updated when adding comments.
        await post.save({ timestamps: false });
        await post.populate('comments');
        return res.json(post);
      } catch (error) {
        console.error(error);
        return res.status(500).json(error);
      }
    }
  },
];

// Delete a comment
export const deleteComment = [
  authorizeAccessToken,
  async (req: Request, res: Response) => {
    try {
      const post = await Posts.findById(req.params.postId).exec();
      if (!post) return res.status(404).json('Post not found');
      // Removing the comment to be deleted from parent post's list of comments
      post.comments = post.comments.filter((comment) => comment.toString() !== req.params.commentId);
      // Ensuring updatedAt timestamp is not updated when deleting comments.
      await post.save({ timestamps: false });
      await Comments.findByIdAndDelete(req.params.commentId).exec();
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  },
];
