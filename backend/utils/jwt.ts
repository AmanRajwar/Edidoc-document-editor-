require('dotenv').config();
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "./ErrorHandler";
import { JwtPayload } from "jsonwebtoken";

interface ITokenOptions {
    expires: Date,
    maxAge: number,
    httpOnly: boolean,
    sameSite: "lax" | 'strict' | 'none' | undefined,
    secure?: boolean
}

// Parse environment variables to integrate with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5', 10); // 5 minutes
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '3', 10); // 3 days

// Cookie options for access token
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // convert minutes to milliseconds
    maxAge: accessTokenExpire * 60 * 1000, // convert minutes to milliseconds
    httpOnly: true,
    sameSite: 'lax'
}

// Cookie options for refresh token
export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // convert days to milliseconds
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // convert days to milliseconds
    httpOnly: true,
    sameSite: 'lax'
}

export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    return res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
};



//function to refresh token
export const updateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.cookies;
        console.log("update access token", refresh_token);

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string || '') as JwtPayload;

        const message = 'Could not refresh token';
        if (!decoded) {
            return next(new ErrorHandler(message, 400))
        }

        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.ACCESS_TOKEN as string,
            {
                expiresIn: "5m"
            })

        const refreshToken = jwt.sign(
            { id: decoded.id },
            process.env.REFRESH_TOKEN as string,
            {
                expiresIn: '3d',
            })

        req.user = decoded.id;
        res.cookie("access_token", accessToken, accessTokenOptions)
        res.cookie("refresh_token", refreshToken, refreshTokenOptions)
    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
}