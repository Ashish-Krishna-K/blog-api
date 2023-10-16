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
exports.logout = exports.getToken = exports.authorizeRefreshToken = exports.authorizeAccessToken = exports.login = exports.signUp = exports.verifyStrategy = void 0;
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
const login = (req, res, next) => {
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
};
exports.login = login;
const authorizeAccessToken = (req, res, next) => {
    const token = extractToken(req);
    if (!token)
        return res.sendStatus(401).json('Token not available');
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
        if (error) {
            console.error(error);
            return res.sendStatus(403).json('Token not valid');
        }
        if (data) {
            req.user = typeof data === 'string' ? { id: data } : { id: data.user.id };
        }
        return next();
    });
};
exports.authorizeAccessToken = authorizeAccessToken;
const authorizeRefreshToken = (req, res, next) => {
    const token = extractToken(req);
    if (!token)
        return res.sendStatus(401).json('Token not available');
    jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error(error);
            return res.sendStatus(403).json('Token not valid');
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
            return res.json(newToken.refreshToken);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29udHJvbGxlcnMvYXV0aENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseURBQTJEO0FBQzNELGdFQUErQjtBQUMvQix3RUFBMkM7QUFDM0MsdUNBQXlDO0FBQ3pDLHdEQUFnQztBQUNoQyxtREFBMkQ7QUFVM0QsTUFBTSxhQUFhLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRTtJQUNuQyxNQUFNLFdBQVcsR0FBRyxzQkFBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW9CLEVBQUU7UUFDckUsU0FBUyxFQUFFLElBQUk7S0FDaEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxZQUFZLEdBQUcsc0JBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFxQixDQUFDLENBQUM7SUFDekUsT0FBTztRQUNMLFdBQVc7UUFDWCxZQUFZO0tBQ2IsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBWSxFQUFzQixFQUFFO0lBQ3hELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUMsSUFBSSxDQUFDLE1BQU07UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUM5QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDO0FBRVcsUUFBQSxjQUFjLEdBQUcsSUFBSSx5QkFBYSxDQUM3QztJQUNFLGFBQWEsRUFBRSxPQUFPO0lBQ3RCLGFBQWEsRUFBRSxVQUFVO0lBQ3pCLGlCQUFpQixFQUFFLElBQUk7Q0FDeEIsRUFDRCxDQUFPLEdBQUcsRUFBRSxLQUFLLEVB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