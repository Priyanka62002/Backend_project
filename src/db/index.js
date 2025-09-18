import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


const connectDB = async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongodb connected  ${connectionInstance}`);
        console.log(`mongodb connected  to db host ${connectionInstance.connection.host}`); //to see which host we are connected t
    }
    catch(error){
        console.log("Error connecting to the database",error);
        process.exit(1);  //need to see
    }
}

export default connectDB
