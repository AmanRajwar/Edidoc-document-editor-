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
exports.signin = exports.getUserInfo = exports.signup = void 0;
require('dotenv').config();
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const ErrorHandler_1 = require("../utils/ErrorHandler");
exports.signup = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return next(new ErrorHandler_1.ErrorHandler("Enter full credentials", 400));
        }
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser)
            return next(new ErrorHandler_1.ErrorHandler("User already exists", 401));
        const user = yield user_model_1.default.create({ firstName, lastName, email, password });
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Unable to create user ", 500));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.getUserInfo = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user;
        if (!id) {
            return next(new ErrorHandler_1.ErrorHandler("No User Found ", 400));
        }
        const user = yield user_model_1.default.findById(id).select('-password');
        if (!user)
            return next(new ErrorHandler_1.ErrorHandler("No User ", 400));
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
exports.signin = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.ErrorHandler("Enter full credentials", 400));
        }
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user)
            return next(new ErrorHandler_1.ErrorHandler("User already exists", 401));
        const passwordMatch = yield user.comparePassword(password);
        if (!passwordMatch) {
            return next(new ErrorHandler_1.ErrorHandler('Invalid email or password', 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
}));
