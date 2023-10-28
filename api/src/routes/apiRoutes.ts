import express from 'express';
import { getToken, login, logout, signUp } from '../controllers/authController';
import {
  createNewPost,
  deletePost,
  editPost,
  getAllPosts,
  getSinglePost,
  publishPost,
} from '../controllers/postsController';
import { createComment, deleteComment } from '../controllers/commentsController';
const router = express.Router();

// Post signup route
router.post('/signup', signUp);

// Post login route
router.post('/login', login);

// Get access token route
router.get('/token', getToken);

// Delete logout route
router.delete('/logout', logout);

// Get all posts
router.get('/posts', getAllPosts);

// Create new post
router.post('/posts', createNewPost);

// Get single post
router.get('/posts/:postId', getSinglePost);

// Edit a post
router.put('/posts/:postId', editPost);

// Delete a post
router.delete('/posts/:postId', deletePost);

// Publish/Unpublish post
router.put('/posts/:postId/publish', publishPost);

// Create new comment
router.post('/posts/:postId/comments', createComment);

// Delete a comment
router.delete('/posts/:postId/comments/:commentId', deleteComment);

export default router;
