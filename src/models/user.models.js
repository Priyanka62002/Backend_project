import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,   //cloudinary service is used here
        required:true,
    },
    coverImage:{
        type:String,

    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video",
    },
    password:{
        type:String,
        required:[true,"Password is required"],

    },
    refreshToken:{
        type:String,
    }
    
  },
  {timestamps:true}
)

userSchema.pre("save",async function(next){  
    if(!this.isModified("password"))return next();  //this is to check only if the password is modified then only it is encrypted not otherwise

    this.password = await bcrypt.hash(this.password,10);   //here 10 denotes the rounds
    next();
})

//custom methods can also be designed for checking the passwords and all, whether the password is correct or not etc
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

//callback dosent give the right to handle this.objectname thus callback is not used here
userSchema.methods.generateAccessToken=function(){

    //access token is short lived token
    //till i have access token i can access the resources
    //access token is not stored in db
    //everytime we dont need to put password and all so we use refresh token to generate new access token
    // refresh token hits an endpoint ans the server verifies it with the stored access token and then generates new access token
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken=function(){

    //refresh token is long lived token
    //it is used to generate new access token when access token expires
    //refresh token is stored in db as well as given to user also
     
     return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User=mongoose.model("User",userSchema)