import express from 'express';
import { createToken } from '../controllers/tokenController';
import { createNewPost, deletePost, editPost, getAllPosts, getSinglePost } from '../controllers/postsController';
import { createComment, deleteComment, getAllComments } from '../controllers/commentsController';
const router = express.Router();

// For generating jwt
router.post('/token', createToken);

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

// Get all comments
router.get('/comments', getAllComments);

// Create new comment
router.post('/comments', createComment);

// Delete a comment
router.delete('/comments/:commentId', deleteComment);

export default router;
