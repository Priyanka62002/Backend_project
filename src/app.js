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

//routes import
import router from "./routes/user.router.js";

//routes declaration
//now to bring routes we need to bring middlewaes
app.use("/api/v1/users",router)
//as it is api call v1 version and users route is mentioned
//from here the route will be handed to:
//https:localhost:8000/api/v1/users
//and then it will be handed over to userRouter


export {app};