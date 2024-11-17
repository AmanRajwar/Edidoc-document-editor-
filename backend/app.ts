import express , {NextFunction, Request, Response}  from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.route";
import { ErrorMiddleware } from "./middleware/error";
import documentRouter from "./routes/document.route";
export const app = express();


app.use(express.json({ limit: "50mb" }))

//cookie parser
app.use(cookieParser());

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))

//routes
app.use('/api/v1',userRouter,documentRouter)

//testing api
app.get('/test', (req:Request, res:Response, next:NextFunction)=>{
    res.status(200).json({
        success:true,
        msessage:"API is working"
    })
})


app.use(ErrorMiddleware)


