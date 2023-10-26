"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexController_1 = require("../controllers/indexController");
const router = express_1.default.Router();
// GET home page.
router.get('/', indexController_1.getHomePage);
// GET Single post page.
router.get('/post/:postId', indexController_1.getSinglePost);
// POST Add comment.
router.post('/post/:postId/comment/create', indexController_1.postAddCommentForm);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLG9FQUFnRztBQUNoRyxNQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhDLGlCQUFpQjtBQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSw2QkFBVyxDQUFDLENBQUM7QUFFN0Isd0JBQXdCO0FBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLCtCQUFhLENBQUMsQ0FBQztBQUUzQyxvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxvQ0FBa0IsQ0FBQyxDQUFDO0FBRWhFLGtCQUFlLE1BQU0sQ0FBQyJ9