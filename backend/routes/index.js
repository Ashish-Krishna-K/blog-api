const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// post routes

router.get('/post', postController.get_posts_list);

router.get('/post/:postId', postController.get_single_post);

// comment routes

router.get('/post/:postId/comment/:commentId', commentController.get_comment);

router.post('/post/:postId/comment/create', commentController.create_comment);

module.exports = router;
