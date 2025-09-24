import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async(req,res)=>{
   //get the user details 
   //validation-check that no space is empty
   //check if user already exists:username, email
   //check for images, check for avatar
   //upload them to cloudinary,and check whether avatar is uploaded or not
   //create user object-create entry in db
   //remove password and refresh token field from response of db
   //check whether user is created or not succesfuly
   //return response 
   const {fullname, email, username, password} = req.body;
   console.log("email",email);
       /*
        some() is an array method in JavaScript.
        It tests whether at least one element in the array passes the condition given in a callback function.
         It returns:

         ✅ true → if at least one element matches the condition.
         ❌ false → if no element matches.
        */
    if(
        [fullname,email,username,password].some((field)=>
            field?.trim()==="")  //if the field is empty after trim then it returns true and thus next part is executed
    ){
        throw new ApiError(400,"all fields are required")
    }

    //match user or username
    const existedUser = User.findOne({  //findOne is a function that is used to find the first db entry that matches either username or email
        $or:[{username},{email}]  //MongoDb logical or operator
    })
    if(existedUser){
        throw new ApiError(409,"user with email or username already exists")
    }

    //now for images or avatar

    //allt the data is stored in req.body by expres
    //middleware adds more fields to request
    //multer gives access to req.files
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log("avatarLocalPath",avatarLocalPath);
    const coverImageLocalPath = req.files?.coverImaage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required")
    }

    //upload files on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(500,"could not upload avatar, please try again")
    }

    //db creation
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase(),
    })
    //mongodb automatically adds _id with every entry in db
    const createdUser = await User.findById(user._id)
    .select(
        "-password -refreshToken"  //- sign is used to exclude these fields from the response
    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user, please try again")
    }
    //res.json({createdUser})
    return res.status(201).json(
        new ApiResponse(
            200,createdUser,"user has been registered successfully"
        )
    )

})
export {registerUser};