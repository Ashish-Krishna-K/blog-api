"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAddCommentForm = exports.getSinglePost = exports.getHomePage = void 0;
const helpers_1 = require("../helpers");
const getHomePage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryString = req.query.cursor
            ? req.query.direction
                ? `?f=${req.query.cursor}&d=${req.query.direction}`
                : `?f=${req.query.cursor}`
            : '';
        const url = `${process.env.API_URI}/posts${queryString}`;
        const response = yield fetch(url, { mode: 'cors' });
        const data = (yield response.json());
        if (!response.ok)
            throw new Error(response.statusText);
        const { posts } = data;
        const previous = data.previousCount > 0 ? new Date(posts[0].createdAt).getTime() : undefined;
        const next = data.nextCount > 0 ? new Date(posts[posts.length - 1].createdAt).getTime() : undefined;
        const modifiedPosts = posts.map((post) => (Object.assign(Object.assign({}, post), { text: (0, helpers_1.getUnescapedHtml)(post.text), createdAt: (0, helpers_1.getDateFormatted)(new Date(post.createdAt)), updatedAt: (0, helpers_1.getDateFormatted)(new Date(post.updatedAt)) })));
        return res.render('home', {
            title: 'Recent Posts',
            previous,
            next,
            posts: modifiedPosts,
        });
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
});
exports.getHomePage = getHomePage;
const getSinglePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const url = `${process.env.API_URI}/posts/${postId}`;
        const response = yield fetch(url, { mode: 'cors' });
        const post = (yield response.json());
        if (!response.ok)
            throw new Error(response.statusText);
        const modifiedPost = Object.assign(Object.assign({}, post), { text: (0, helpers_1.getUnescapedHtml)(post.text), comments: post.comments.map((comment) => {
                if (typeof comment === 'object') {
                    return Object.assign(Object.assign({}, comment), { text: (0, helpers_1.getUnescapedHtml)(comment.text) });
                }
                else {
                    return comment;
                }
            }), createdAt: (0, helpers_1.getDateFormatted)(new Date(post.createdAt)), updatedAt: (0, helpers_1.getDateFormatted)(new Date(post.updatedAt)) });
        return res.render('singlePost', {
            title: modifiedPost.title,
            post: modifiedPost,
        });
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
});
exports.getSinglePost = getSinglePost;
const postAddCommentForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Not yet implemented');
});
exports.postAddCommentForm = postAddCommentForm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJzL2luZGV4Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSx3Q0FBZ0U7QUFFekQsTUFBTSxXQUFXLEdBQUcsQ0FBTyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUNuRixJQUFJO1FBQ0YsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQ2xDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVM7Z0JBQ25CLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO2dCQUNuRCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUM1QixDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sU0FBUyxXQUFXLEVBQUUsQ0FBQztRQUN6RCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNwRCxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFjLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkQsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztRQUN2QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFD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