import express from 'express'
import {getUserInfo, signin, signup} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/AuthMiddleware";

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/user-info',isAuthenticated ,getUserInfo);

export default userRouter;
