"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const userRouter = express_1.default.Router();
userRouter.post('/signup', user_controller_1.signup);
userRouter.post('/signin', user_controller_1.signin);
userRouter.get('/user-info', AuthMiddleware_1.isAuthenticated, user_controller_1.getUserInfo);
exports.default = userRouter;
