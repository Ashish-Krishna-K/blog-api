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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.publishPost = exports.editPost = exports.createNewPost = exports.getSinglePost = exports.getAllPosts = void 0;
const postsModel_1 = __importDefault(require("../models/postsModel"));
const authController_1 = require("./authController");
const express_validator_1 = require("express-validator");
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const direction = req.query.d;
    const from = (_a = req.query.f) === null || _a === void 0 ? void 0 : _a.toString();
    // get a boolen based on token exists or not in the request object.
    const token = !!(0, authController_1.extractToken)(req);
    const getForwardQuery = (from) => {
        // A function to return a query filter for forward direction(in descending order
        // of created timestamp which is equivalent to latest first)
        return {
            $lt: from || Date.now().toString(),
        };
    };
    const getBackwardQuery = (from) => {
        // A function to return a query filter for reverse direction(in ascending order
        // of created timestamp which is equivalent to oldest first)
        return {
            $gt: from || new Date(0).getTime(),
        };
    };
    const mainQuery = direction !== 'prev' ? getForwardQuery(from) : getBackwardQuery(from);
    const sort = direction === 'prev' ? 1 : -1;
    try {
        const posts = yield postsModel_1.default.find(
        // if token exists, request is coming from CMS so filter all the posts,
        // if token doesn't exist, request is coming from client so filter only
        // published posts
        token
            ? {
                createdAt: mainQuery,
            }
            : {
                createdAt: mainQuery,
                isPublished: true,
            })
            .sort({ createdAt: sort })
            .limit(5)
            .populate('author', 'firstName lastName')
            .exec();
        // no posts matching the query is found
        if (posts.length < 1)
            return res.status(404).json(posts);
        // create a query to get the count of posts previous to the cursor post
        const prevQuery = 
        // when direction is not previous, the previous count refers to the count of posts which is more
        // recent than the first item of the current results, when direction is previous, previous count
        // refers to the count of posts which is older than
        direction !== 'prev'
            ? getBackwardQuery(posts[0].createdAt || Date.now().toString())
            : getBackwardQuery(posts[posts.length - 1].createdAt);
        const nextQuery = direction !== 'prev' ? getForwardQuery(posts[posts.length - 1].createdAt) : getForwardQuery(posts[0].createdAt);
        const previousCount = yield postsModel_1.default.countDocuments(token
            ? {
                createdAt: prevQuery,
            }
            : {
                createdAt: prevQuery,
                isPublished: true,
            }).exec();
        const nextCount = yield postsModel_1.default.countDocuments(token
            ? {
                createdAt: nextQuery,
            }
            : {
                createdAt: nextQuery,
                isPublished: true,
            }).exec();
        if (sort === 1)
            posts.reverse();
        const data = {
            previousCount,
            nextCount,
            posts,
        };
        return res.json(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.getAllPosts = getAllPosts;
const getSinglePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = !!(0, authController_1.extractToken)(req);
        const post = yield postsModel_1.default.findById(req.params.postId)
            .populate('author', 'firstName lastName')
            .populate('comments')
            .exec();
        if (!post)
            return res.sendStatus(404);
        if (!post.isPublished && !token)
            return res.sendStatus(403);
        return res.json(post);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
exports.getSinglePost = getSinglePost;
exports.createNewPost = [
    authController_1.authorizeAccessToken,
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required').escape(),
    (0, express_validator_1.body)('text').trim().notEmpty().withMessage('Text is required').escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const errors = (0, express_validator_1.validationResult)(req);
        const formData = {
            title: req.body.title,
            text: req.body.text,
        };
        if (!errors.isEmpty()) {
            return res.status(406).json({
                formData,
                errors: errors.array(),
            });
        }
        else {
            const post = new postsModel_1.default({
                title: formData.title,
                text: formData.text,
                author: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            });
            try {
                yield post.save();
                return res.status(201).json(post);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json(error);
            }
        }
    }),
];
exports.editPost = [
    authController_1.authorizeAccessToken,
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required').escape(),
    (0, express_validator_1.body)('text').trim().notEmpty().withMessage('Text is required').escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const formData = {
            title: req.body.title,
            text: req.body.text,
        };
        if (!errors.isEmpty()) {
            return res.status(406).json({
                formData,
                errors: errors.array(),
            });
        }
        else {
            try {
                const post = yield postsModel_1.default.findById(req.params.postId).exec();
                if (!post)
                    return res.status(404).json('Post not found');
                post.title = formData.title;
                post.text = formData.text;
                yield post.save();
                return res.json(post);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json(error);
            }
        }
    }),
];
exports.publishPost = [
    authController_1.authorizeAccessToken,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const post = yield postsModel_1.default.findById(req.body.postId, 'isPublished').exec();
            if (!post)
                return res.status(404).json('Post not found');
            post.isPublished = !post.isPublished;
            yield post.save({ timestamps: false });
            res.sendStatus(200);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }),
];
exports.deletePost = [
    authController_1.authorizeAccessToken,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const post = yield postsModel_1.default.findById(req.params.postId).exec();
            if (!post)
                return res.sendStatus(200);
            yield Promise.all(post.comments.map((comment) => { var _a; return (_a = commentsModel_1.default.findByIdAndDelete(comment).exec()) !== null && _a !== void 0 ? _a : []; }));
            yield postsModel_1.default.findByIdAndDelete(req.params.postId).exec();
            return res.sendStatus(200);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }),
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHNDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL3Bvc3RzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxzRUFBeUM7QUFDekMscURBQXNFO0FBQ3RFLHlEQUEyRDtBQUMzRCw0RUFBK0M7QUFFeEMsTUFBTSxXQUFXLEdBQUcsQ0FBTyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7O0lBQy9ELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sSUFBSSxHQUFHLE1BQUEsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLDBDQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ3JDLG1FQUFtRTtJQUNuRSxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBQSw2QkFBWSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sZUFBZSxHQUFHLENBQUMsSUFBOEMsRUFBRSxFQUFFO1FBQ3pFLGdGQUFnRjtRQUNoRiw0REFBNEQ7UUFDNUQsT0FBTztZQUNMLEdBQUcsRUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRTtTQUNuQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQThDLEVBQUUsRUFBRTtRQUMxRSwrRUFBK0U7UUFDL0UsNERBQTREO1FBQzVELE9BQU87WUFDTCxHQUFHLEVBQUUsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtTQUNuQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBQ0YsTUFBTSxTQUFTLEdBQUcsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJ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