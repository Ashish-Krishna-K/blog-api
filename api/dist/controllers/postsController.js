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
exports.deletePost = exports.editPost = exports.createNewPost = exports.getSinglePost = exports.getAllPosts = void 0;
const postsModel_1 = __importDefault(require("../models/postsModel"));
const authController_1 = require("./authController");
const express_validator_1 = require("express-validator");
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const direction = req.query.d;
    const from = (_a = req.query.f) === null || _a === void 0 ? void 0 : _a.toString();
    const getForwardQuery = (from) => {
        return {
            $lt: from || Date.now().toString(),
        };
    };
    const getBackwardQuery = (from) => {
        return {
            $gt: from || new Date(0).getTime(),
        };
    };
    const mainQuery = direction !== 'prev' ? getForwardQuery(from) : getBackwardQuery(from);
    const sort = direction === 'prev' ? 1 : -1;
    try {
        const posts = yield postsModel_1.default.find({ createdAt: mainQuery })
            .sort({ createdAt: sort })
            .limit(5)
            .populate('author', 'firstName lastName')
            .exec();
        if (posts.length < 1)
            return res.status(404).json(posts);
        const previousCount = yield postsModel_1.default.countDocuments({
            createdAt: direction !== 'prev'
                ? getBackwardQuery(posts[0].createdAt || Date.now().toString())
                : getBackwardQuery(posts[posts.length - 1].createdAt),
        }).exec();
        const nextCount = yield postsModel_1.default.countDocuments({
            createdAt: direction !== 'prev' ? getForwardQuery(posts[posts.length - 1].createdAt) : getForwardQuery(posts[0].createdAt),
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
        const post = yield postsModel_1.default.findById(req.params.postId)
            .populate('author', 'firstName lastName')
            .populate('comments')
            .exec();
        if (!post)
            return res.sendStatus(404);
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
            const post = yield postsModel_1.default.findById(req.params.postId)
                .populate('author', 'firstName lastName')
                .populate('comments')
                .exec();
            if (!post)
                return res.status(404).json('Post not found');
            post.title = formData.title;
            post.text = formData.text;
            try {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHNDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL3Bvc3RzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxzRUFBeUM7QUFDekMscURBQXdEO0FBQ3hELHlEQUEyRDtBQUMzRCw0RUFBK0M7QUFFeEMsTUFBTSxXQUFXLEdBQUcsQ0FBTyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7O0lBQy9ELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE1BQU0sSUFBSSxHQUFHLE1BQUEsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLDBDQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ3JDLE1BQU0sZUFBZSxHQUFHLENBQUMsSUFBOEMsRUFBRSxFQUFFO1FBQ3pFLE9BQU87WUFDTCxHQUFHLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUU7U0FDbkMsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUNGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUE4QyxFQUFFLEVBQUU7UUFDMUUsT0FBTztZQUNMLEdBQUcsRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO1NBQ25DLENBQUM7SUFDSixDQUFDLENBQUM7SUFDRixNQUFNLFNBQVMsR0FBRyxTQUFTLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hGLE1BQU0sSUFBSSxHQUFHLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sb0JBQUss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