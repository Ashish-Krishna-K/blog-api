const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', userController.signup_post);

router.post('/login', userController.login_post);

router.post('/logout', userController.logout_post);

// delete this later
router.get('/testing', userController.testing);

router.get('/:userId/dashboard');

// post routes

router.get('/post', postController.get_posts_list);

router.get('/post/:postId', postController.get_single_post);

router.put('/post/:postId', postController.edit_post);

router.put('/post/:postId/publish', postController.publish_post);

router.put('/post/:postId/unpublish', postController.unpublish_post);

router.delete('/post/:postId', postController.delete_post);

router.post('/post/create', postController.create_post);

// comment routes

router.get('/post/:postId/comment')

router.get('/post/:postId/comment/:commentId');

router.delete('/post/:postId/comment/:commentId');

router.post('/post/:postId/comment/create');

module.exports = router;
