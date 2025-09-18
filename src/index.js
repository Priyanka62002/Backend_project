//require('dotenv').config({path:'./env'})

import dotenv from 'dotenv'; 
import connectDB from './db/index.js';


dotenv.config({
    path:"./.env"     //maybe . is not there in .env
})

connectDB()  //calling the function to connect to the database
.then(()=>{

    app.on("error",(error)=>{  
        console.log("error in app",error);
        throw error;
      })
    //here before app.listen we need to put app.on error 
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is runing at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection failed",err)
})
//this is one approach to connect to the database
/*(async()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    }
    catch(err){
        console.error("Error connecting to the database",err);
        throw err;

    }
})()*/