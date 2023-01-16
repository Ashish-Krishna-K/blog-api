const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', userController.signup_post);

router.post('/login', userController.login_post);

router.post('/logout', userController.logout_post);

router.get('/:userId/dashboard');

// post routes

router.get(':userId/post');

router.get(':userId/post/:postId');

router.put(':userId/post/:postId');

router.delete(':userId/post/:postId');

router.post(':userId/post/create');

// comment routes

router.get(':userId/post/:postId/comment')

router.get(':userId/post/:postId/comment/:commentId');

router.delete(':userId/post/:postId/comment/:commentId');

router.post(':userId/post/:postId/comment/create');

module.exports = router;
