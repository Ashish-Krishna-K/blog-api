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
exports.logout = exports.getToken = exports.authorizeRefreshToken = exports.authorizeAccessToken = exports.login = exports.signUp = exports.verifyStrategy = exports.extractToken = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorModel_1 = __importDefault(require("../models/authorModel"));
const bcryptjs_1 = require("bcryptjs");
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const generateToken = (id) => {
    const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
    return {
        accessToken,
        refreshToken,
    };
};
const extractToken = (req) => {
    const bearer = req.headers['authorization'];
    if (!bearer)
        return undefined;
    return bearer.split(' ')[1];
};
exports.extractToken = extractToken;
exports.verifyStrategy = new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield authorModel_1.default.findOne({ email }).exec();
        if (!admin)
            return done(null, false, { message: 'Email not found' });
        const result = yield (0, bcryptjs_1.compare)(password, admin.hashedPassword);
        if (!result)
            return done(null, false, { message: 'Incorrect Password' });
        return done(null, { id: admin.id });
    }
    catch (error) {
        console.error(error);
        return done(error);
    }
}));
exports.signUp = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First Name is required').escape(),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last Name is required').escape(),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage("Email must be of the format 'you@email.com'")
        .escape(),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Password must be atleast 6 characters long.')
        .matches(/[a-z]/g)
        .withMessage('Password must contain atleast 1 lowercase letter')
        .matches(/[A-Z]/g)
        .withMessage('Password must contain atleast 1 uppercase letter')
        .matches(/[0-9]/g)
        .withMessage('Password must contain atleast 1 numeric digit')
        .matches(/[`~!@#$%^&*()_\-+=|\\:;"'<,>.?/]/g)
        .withMessage('Password must contain atleast 1 special character')
        .escape(),
    (0, express_validator_1.body)('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Password must be atleast 6 characters long.')
        .matches(/[a-z]/g)
        .withMessage('Password must contain atleast 1 lowercase letter')
        .matches(/[A-Z]/g)
        .withMessage('Password must contain atleast 1 uppercase letter')
        .matches(/[0-9]/g)
        .withMessage('Password must contain atleast 1 numeric digit')
        .matches(/[`~!@#$%^&*()_\-+=|\\:;"'<,>.?/]/g)
        .withMessage('Password must contain atleast 1 special character')
        .custom((value, { req }) => req.body.password === value)
        .withMessage('Passwords do not match')
        .escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        };
        if (!errors.isEmpty()) {
            return res.status(406).json({
                formData,
                errors: errors.array(),
            });
        }
        else {
            try {
                const hashedPassword = yield (0, bcryptjs_1.hash)(req.body.password, 16);
                const admin = new authorModel_1.default({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    hashedPassword,
                });
                yield admin.save();
                return res.sendStatus(201);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json(error);
            }
        }
    }),
];
exports.login = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage("Email must be of the format 'you@email.com'")
        .escape(),
    (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password is required').escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        const formData = {
            email: req.body.email,
            password: req.body.password,
        };
        if (!errors.isEmpty()) {
            return res.status(406).json({
                formData,
                errors: errors.array(),
            });
        }
        passport_1.default.authenticate('local', {
            session: false,
        }, (error, user, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error(error);
                return res.status(500).json(error);
            }
            if (!user)
                return res.status(401).json(info);
            const token = generateToken(user.id);
            try {
                const admin = yield authorModel_1.default.findById(user.id).exec();
                if (admin) {
                    admin.validToken = token.refreshToken;
                    yield admin.save();
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json(error);
            }
            return res.json(token);
        }))(req, res, next);
    },
];
const authorizeAccessToken = (req, res, next) => {
    const token = (0, exports.extractToken)(req);
    if (!token)
        return res.status(401).json('Token not available');
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
        if (error) {
            console.error(error);
            return res.status(403).json('Token not valid');
        }
        if (data) {
            req.user = typeof data === 'string' ? { id: data } : { id: data.id };
        }
        return next();
    });
};
exports.authorizeAccessToken = authorizeAccessToken;
const authorizeRefreshToken = (req, res, next) => {
    const token = (0, exports.extractToken)(req);
    if (!token)
        return res.status(401).json('Token not available');
    jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error(error);
            return res.status(403).json('Token not valid');
        }
        if (data) {
            const userId = typeof data === 'string' ? data : data.id;
            try {
                const admin = yield authorModel_1.default.findById(userId).exec();
                if (!admin)
                    return res.status(404).json('User not found.');
                if (admin.validToken !== token)
                    return res.status(403).json('Token is not valid');
                req.user = { id: admin.id };
            }
            catch (error) {
                console.error(error);
                return res.status(500).json(error);
            }
        }
        return next();
    }));
};
exports.authorizeRefreshToken = authorizeRefreshToken;
exports.getToken = [
    exports.authorizeRefreshToken,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const admin = yield authorModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).exec();
            if (!admin)
                return res.status(401).json('User not found.');
            const newToken = generateToken(admin.id);
            return res.json(newToken.accessToken);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }),
];
exports.logout = [
    exports.authorizeRefreshToken,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const admin = yield authorModel_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b.id).exec();
            if (admin) {
                admin.validToken = '';
                yield admin.save();
            }
            return res.sendStatus(200);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    }),
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseURBQTJEO0FBQzNELGdFQUErQjtBQUMvQix3RUFBMkM7QUFDM0MsdUNBQXlDO0FBQ3pDLHdEQUFnQztBQUNoQyxtREFBMkQ7QUFVM0QsTUFBTSxhQUFhLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRTtJQUNuQyxNQUFNLFdBQVcsR0FBRyxzQkFBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW9CLEVBQUU7UUFDckUsU0FBUyxFQUFFLElBQUk7S0FDaEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxZQUFZLEdBQUcsc0JBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFxQixDQUFDLENBQUM7SUFDekUsT0FBTztRQUNMLFdBQVc7UUFDWCxZQUFZO0tBQ2IsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVLLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBWSxFQUFzQixFQUFFO0lBQy9ELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLE1BQU07UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUM5QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDO0FBSlcsUUFBQSxZQUFZLGdCQUl2QjtBQUVXLFFBQUEsY0FBYyxHQUFHLElBQUkseUJBQWEsQ0FDN0M7SUFDRSxhQUFhLEVBQUUsT0FBTztJQUN0QixhQUFhLEVBQUUsVUFBVTtJQUN6QixpQkFBaUIsRUFBRSxJQUFJO0NBQ3hCLEVBQ0Qs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