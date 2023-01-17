const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// post routes

router.get('/post', postController.get_posts_list);

router.get('/post/:postId', postController.get_single_post);

// comment routes

router.get('/post/:postId/comment/:commentId');

router.post('/post/:postId/comment/create');

module.exports = router;
