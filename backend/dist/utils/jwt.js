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
exports.updateAccessToken = exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = require("./ErrorHandler");
// Parse environment variables to integrate with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5', 10); // 5 minutes
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '3', 10); // 3 days
// Cookie options for access token
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // convert minutes to milliseconds
    maxAge: accessTokenExpire * 60 * 1000, // convert minutes to milliseconds
    httpOnly: true,
    sameSite: 'lax'
};
// Cookie options for refresh token
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // convert days to milliseconds
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // convert days to milliseconds
    httpOnly: true,
    sameSite: 'lax'
};
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    return res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
});
exports.sendToken = sendToken;
//function to refresh token
const updateAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refresh_token } = req.cookies;
        console.log("update access token", refresh_token);
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN || '');
        const message = 'Could not refresh token';
        if (!decoded) {
            return next(new ErrorHandler_1.ErrorHandler(message, 400));
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m"
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.REFRESH_TOKEN, {
            expiresIn: '3d',
        });
        req.user = decoded.id;
        res.cookie("access_token", accessToken, exports.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler(error.message, 400));
    }
});
exports.updateAccessToken = updateAccessToken;
