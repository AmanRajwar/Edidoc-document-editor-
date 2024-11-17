require('dotenv').config();
import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncError"
import { updateAccessToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";


export const isAuthenticated = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { access_token, refresh_token } = req.cookies;

        //if only access token or both the cookies expired or user removed them  
        if (!access_token) {
            if (refresh_token) {
                updateAccessToken(req, res, next);
            }
            else
                return next(new ErrorHandler("please login to access this resource", 400))
        } else {
            // Decode the token without verifying to check the expiration time
            let decoded = jwt.decode(access_token) as JwtPayload;

            if (!decoded) {
                return next(new ErrorHandler("Access token is not valid", 400));
            }
            //if token expired then need to update the access token using refresh token 
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                updateAccessToken(req, res, next);
            } else {
                decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string || '') as JwtPayload;
                req.user = decoded.id
            }
        }
        next();
    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler("Not Authenticated", 500));
    }
})




