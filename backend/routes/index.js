var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// post routes

router.get('/post');

router.get('/post/:postId');

// comment routes

router.get('/post/:postId/comment/:commentId');

router.post('/post/:postId/comment/create');

module.exports = router;
