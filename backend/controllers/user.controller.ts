require('dotenv').config();
import { Request, Response, NextFunction } from "express"
import { catchAsyncErrors } from "../middleware/catchAsyncError"
import User from "../models/user.model";
import { sendToken } from "../utils/jwt";
import { ErrorHandler } from "../utils/ErrorHandler";

export const signup = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return next(new ErrorHandler("Enter full credentials", 400))
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) return next(new ErrorHandler("User already exists", 401))

        const user = await User.create({ firstName, lastName, email, password });

        if (!user) {
            return next(new ErrorHandler("Unable to create user ", 500))
        }
        sendToken(user, 200, res)

    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
})


export const getUserInfo = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user;

        if (!id) {
            return next(new ErrorHandler("No User Found ", 400))
        }
        const user = await User.findById(id).select('-password');

        if (!user) return next(new ErrorHandler("No User ", 400))

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
})



export const signin = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Enter full credentials", 400))
        }
        const user = await User.findOne({ email }).select("+password");


        if (!user) return next(new ErrorHandler("User already exists", 401))

        const passwordMatch = await user.comparePassword(password)

        if (!passwordMatch) {
            return next(new ErrorHandler('Invalid email or password', 400))
        }

        sendToken(user, 200, res);

    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
})



