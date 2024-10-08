import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}));

app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended: true,limit:"20kb"}));

app.use(express.static('public'));
app.use(cookieParser());

//routes 
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import commentRouter from './routes/comment.routes.js';
import postLikeRouter from './routes/postLike.routes.js';
import connectionRouter from './routes/connection.routes.js';

//routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/post",postRouter)
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/like/post",postLikeRouter);
app.use("/api/v1/connection",connectionRouter);
export default app;