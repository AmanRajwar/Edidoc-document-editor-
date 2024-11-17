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
exports.isAuthenticated = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const jwt_1 = require("../utils/jwt");
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { access_token, refresh_token } = req.cookies;
        //if only access token or both the cookies expired or user removed them  
        if (!access_token) {
            if (refresh_token) {
                (0, jwt_1.updateAccessToken)(req, res, next);
            }
            else
                return next(new ErrorHandler_1.ErrorHandler("please login to access this resource", 400));
        }
        else {
            // Decode the token without verifying to check the expiration time
            let decoded = jsonwebtoken_1.default.decode(access_token);
            if (!decoded) {
                return next(new ErrorHandler_1.ErrorHandler("Access token is not valid", 400));
            }
            //if token expired then need to update the access token using refresh token 
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                (0, jwt_1.updateAccessToken)(req, res, next);
            }
            else {
                decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN || '');
                req.user = decoded.id;
            }
        }
        next();
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.ErrorHandler("Not Authenticated", 500));
    }
}));
