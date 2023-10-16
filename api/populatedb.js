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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config.js");
var mongoose_1 = require("mongoose");
var postsModel_1 = require("./src/models/postsModel");
var commentsModel_1 = require("./src/models/commentsModel");
var connectToDb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('connecting to database...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, mongoose_1.default.connect(process.env.MONGODB_URI)];
            case 2:
                _a.sent();
                console.log('connected');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna. Nunc ex dolor, molestie a mauris sed, convallis hendrerit libero. Sed hendrerit metus porttitor, interdum leo eget, placerat lorem. Nam viverra id velit nec vestibulum. Nullam pulvinar ligula finibus tempor malesuada. Vestibulum sed placerat nisi. Nam tempor pellentesque gravida. Aliquam cursus tortor eu risus auctor tempus.\n Morbi pharetra rhoncus ligula sed pharetra. Mauris in tellus in lacus scelerisque vulputate. Suspendisse ac ante odio. Aliquam euismod purus vel fermentum feugiat. Vestibulum sodales sapien vitae dolor eleifend, lobortis ullamcorper est ornare. Phasellus commodo massa eu orci pulvinar pretium. Pellentesque tincidunt elementum dui sit amet interdum. Morbi sed sagittis nisi. Nam pretium, dolor id sagittis fringilla, sapien quam facilisis quam, nec pellentesque mi quam non massa. Morbi ornare, erat ut ornare semper, quam leo tempus purus, sit amet rutrum mauris lacus nec libero. Etiam a molestie neque. Sed faucibus tortor ac mi auctor cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam tincidunt nunc sed est mattis ullamcorper. Vivamus a feugiat diam.\nQuisque ultricies, felis quis eleifend condimentum, orci lacus tempor nibh, nec venenatis urna tellus aliquet tortor. Fusce sed elementum augue, eget laoreet lorem. Pellentesque rutrum commodo diam id porta. Cras est ligula, imperdiet pharetra erat quis, ullamcorper sagittis lacus. Ut nibh urna, maximus et nulla vel, volutpat imperdiet risus. Sed at lacus cursus, volutpat ligula ac, rhoncus turpis. Vivamus eget rhoncus nunc.\nNam tempor tempus sollicitudin. Curabitur ac nunc at ipsum viverra molestie. Donec viverra ipsum sed mollis iaculis. Nam interdum cursus rhoncus. Ut ornare porta ante hendrerit consectetur. Nunc gravida nunc at tortor tincidunt, sit amet convallis ligula lobortis. Vivamus nisi ligula, fermentum convallis arcu ut, tincidunt hendrerit turpis. Aliquam ipsum metus, blandit vel vehicula blandit, luctus quis odio. Sed pharetra varius ex sed semper. Quisque non sodales nunc, vel ullamcorper dolor. Fusce cursus congue nulla, vitae ultrices dui scelerisque a. Nulla sollicitudin tortor non risus maximus commodo. Fusce luctus maximus est, sit amet aliquet eros mollis ut. Maecenas non lorem at enim laoreet iaculis id sit amet purus.\nNam augue mauris, mattis a cursus at, rhoncus varius diam. Fusce rutrum, ante posuere consectetur hendrerit, lacus felis porta turpis, sed feugiat mi lacus et augue. Nulla nulla sem, convallis a facilisis vel, pellentesque et arcu. In nec malesuada elit. Curabitur at erat eget lectus pulvinar elementum id ac dolor. Nullam vulputate, magna non pharetra dignissim, ipsum ligula vulputate dolor, vel lacinia tortor lacus non eros. Duis nec nibh nulla. Curabitur ut dapibus ex. Duis nec mollis diam. Aenean accumsan et ante eget ultrices.';
var addPost = function (title) { return __awaiter(void 0, void 0, void 0, function () {
    var newPost, newComment1, newComment2, newComment3, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                newPost = new postsModel_1.default({
                    title: title,
                    text: text,
                    author: '652d7f4900adfe262fa57951',
                });
                return [4 /*yield*/, newPost.save()];
            case 1:
                _a.sent();
                console.log("Post: ".concat(newPost.id, " added."));
                newComment1 = new commentsModel_1.default({
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna.',
                    author: 'test comment',
                });
                newComment2 = new commentsModel_1.default({
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna.',
                    author: 'test comment',
                });
                newComment3 = new commentsModel_1.default({
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla justo viverra, mattis purus ac, dictum magna.',
                    author: 'test comment',
                });
                return [4 /*yield*/, newComment1.save()];
            case 2:
                _a.sent();
                newPost.comments.push(newComment1._id);
                console.log("Comment: ".concat(newComment1.id, " is added to Post: ").concat(newPost.id));
                return [4 /*yield*/, newComment2.save()];
            case 3:
                _a.sent();
                newPost.comments.push(newComment2._id);
                console.log("Comment: ".concat(newComment2.id, " is added to Post: ").concat(newPost.id));
                return [4 /*yield*/, newComment3.save()];
            case 4:
                _a.sent();
                newPost.comments.push(newComment3._id);
                console.log("Comment: ".concat(newComment3.id, " is added to Post: ").concat(newPost.id));
                return [4 /*yield*/, newPost.save()];
            case 5:
                _a.sent();
                console.log('All comments added');
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                console.error(error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
connectToDb();
var count = 0;
var interval = setInterval(function () {
    addPost("Test Post ".concat(count + 1));
    console.log(count);
    count++;
    if (count >= 30)
        clearInterval(interval);
}, 2000);
