import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))     ///extended is used for object within object
app.use(express.static("public"))    //here public is the folder name .... static is used to store files /folders which needs to be public
app.use(cookieParser())  //to parse the cookie coming from the request

export {app};