import express from 'express';
import { getHomePage, getSinglePost, postAddCommentForm } from '../controllers/indexController';
const router = express.Router();

// GET home page.
router.get('/', getHomePage);

// GET Single post page.
router.get('/post/:postId', getSinglePost);

// POST Add comment.
router.post('/post/:postId/comment/create', postAddCommentForm);

export default router;
