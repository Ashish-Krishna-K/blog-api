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

router.get('/post');

router.get('/post/:postId');

router.put('/post/:postId');

router.delete('/post/:postId');

router.post('/post/create', postController.create_post);

// comment routes

router.get('/post/:postId/comment')

router.get('/post/:postId/comment/:commentId');

router.delete('/post/:postId/comment/:commentId');

router.post('/post/:postId/comment/create');

module.exports = router;
