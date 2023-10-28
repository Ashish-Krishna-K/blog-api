"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const postsController_1 = require("../controllers/postsController");
const commentsController_1 = require("../controllers/commentsController");
const router = express_1.default.Router();
// Post signup route
router.post('/signup', authController_1.signUp);
// Post login route
router.post('/login', authController_1.login);
// Get access token route
router.get('/token', authController_1.getToken);
// Delete logout route
router.delete('/logout', authController_1.logout);
// Get all posts
router.get('/posts', postsController_1.getAllPosts);
// Create new post
router.post('/posts', postsController_1.createNewPost);
// Get single post
router.get('/posts/:postId', postsController_1.getSinglePost);
// Edit a post
router.put('/posts/:postId', postsController_1.editPost);
// Delete a post
router.delete('/posts/:postId', postsController_1.deletePost);
// Publish/Unpublish post
router.put('/posts/:postId/publish', postsController_1.publishPost);
// Create new comment
router.post('/posts/:postId/comments', commentsController_1.createComment);
// Delete a comment
router.delete('/posts/:postId/comments/:commentId', commentsController_1.deleteComment);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpUm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9hcGlSb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBOEI7QUFDOUIsa0VBQWdGO0FBQ2hGLG9FQU93QztBQUN4QywwRUFBaUY7QUFDakYsTUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQyxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQU0sQ0FBQyxDQUFDO0FBRS9CLG1CQUFtQjtBQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxzQkFBSyxDQUFDLENBQUM7QUFFN0IseUJBQXlCO0FBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLHlCQUFRLENBQUMsQ0FBQztBQUUvQixzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsdUJBQU0sQ0FBQyxDQUFDO0FBRWpDLGdCQUFnQjtBQUNoQixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSw2QkFBVyxDQUFDLENBQUM7QUFFbEMsa0JBQWtCO0FBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLCtCQUFhLENBQUMsQ0FBQztBQUVyQyxrQkFBa0I7QUFDbEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSwrQkFBYSxDQUFDLENBQUM7QUFFNUMsY0FBYztBQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsMEJBQVEsQ0FBQyxDQUFDO0FBRXZDLGdCQUFnQjtBQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLDRCQUFVLENBQUMsQ0FBQztBQUU1Qyx5QkFBeUI7QUFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSw2QkFBVyxDQUFDLENBQUM7QUFFbEQscUJBQXFCO0FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsa0NBQWEsQ0FBQyxDQUFDO0FBRXRELG1CQUFtQjtBQUNuQixNQUFNLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxFQUFFLGtDQUFhLENBQUMsQ0FBQztBQUVuRSxrQkFBZSxNQUFNLENBQUMifQ==