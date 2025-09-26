import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//generate access and refresh token
const generateAccessAndRefreshTokens=async(userId)=>{
    try{
        const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken=refreshToken //add refresh token to the database
       await user.save({validateBeforeSave:false}) //this is a mongobd method to save the changes made to the document
       //validateBeforeSave is set to false because we dont want to validate the whole document again and again we just want to save the changes
       return {accessToken , refreshToken}  //return both the tokens
    }  
    catch(error){
        throw new ApiError(500,"could not generate access and refresh token, please try again")
    }
}

//register user
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
   console.log("req.body : ",req.body);
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
    const existedUser = await User.findOne({  //findOne is a function that is used to find the first db entry that matches either username or email
        $or:[{username},{email}]  //MongoDb logical or operator
    })
    if(existedUser){
        throw new ApiError(409,"user with email or username already exists")
    }

    //now for images or avatar

    //allt the data is stored in req.body by expres
    //middleware adds more fields to request
    //multer gives access to req.files
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path
    console.log("avatarLocalPath",avatarLocalPath);
   // const coverImageLocalPath = req.files?.coverImage[0]?.path 

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath = req.files.coverImage[0].path
   }
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required")
    }

    //upload files on cloudinary
    //coverImage and avatar themselves are also array of object so [0] is used
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(500,"could not upload avatar, please try again")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    

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

//login user
const loginUser=asyncHandler(async(req,res)=>{
   // get the data from req.body
   // check usename or email already exists or not
   //find the user
   //if user not found ask he user to register
   //if user found then check for password
   //if password not matched generate error
   //if password matches generate refresh and access token
   //send cookie
   //send response

   const {email,username,password} = req.body;

   if(!username && !email){     //** 
    throw new ApiError(404,"username or email is required to login")
   }
   const user = await User.findOne({             //findOne is used to find the first entry that matches the condition
    $or:[{username},{email}]              //either username or email
   })           
   if(!user){
    throw new ApiError(404,"user not found, please signup")
   }

   //here we need the password that is entered by the user because the password of the user that is registeed in the db we woould get that and we just need to check whether they are same or not
   //the methods that are defined by mongoose are used by User
   //by the ones created by us are operted by user because it is an instance of User
       
   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401,"password is incorrect")
   }

   //next step is get access and refresh token
   const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id)  //as db calls are included so we are using await

   const loggedInUser = await User.findById(user._id)
   .select("-password -refreshToken")  //dont want to send password and refresh token to the user

    //send cookie
    const options={
        httpOnly:true,
        secure:true,
        //this is done such that only server can modify the cookie and not the frontend developer or the client
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)  //cookie name is accessToken and its value is accessToken
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken,
            },
            "user logged in successfully"
        )
    )

})

//logout user
const logoutUser=asyncHandler(async(req,res)=>{
    //cookie clearing
    //reset refresh token


    //find the user

    //refresh token set to undefined
    await User.findByIdAndUpdate(
        req.user._id,
        {             //update part
            $set:{
                refreshToken: undefined     //refresh token is to be updated
            }

        },
        {
            new:true  //returns the new updated value
        }
    )

    //cookie clearing
    const options={
        httpOnly:true,
        secure:true,  
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "user logged out successfully"
        )
    )

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    //I need to refresh my access token as my login session has expired
    //access token i refreshed using the refresh token

    //steps:
    //get the refresh token from cookie
    const incomingRefreshToken = req.cokies.refreshToken || req.body.refreshToken     //req.body is used for the mobile ap etc

    if(!incomingRefreshToken){
        throw new ApiError(401,"refresh token not found, user unauthorized")
    }

    //verify token
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            //payload is optional
        )
        console.log("decodedToken : ",decodedToken);
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(401,"invalid refresh token")
        }
        if(incomingRefreshToken !==user?.refreshToken){
            throw new ApiError(401,"refresh token is expires or used")
    
        }
    
        const options={
            httpOnly:true,
            secure:true,
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, 
                    refreshToken : newRefreshToken
                },
                "access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};



/*
ex-
req.files
avatar: [
    {
      fieldname: 'avatar',
      originalname: 'e-4.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './public/temp',
      filename: 'e-4.png',
      path: 'public\\temp\\e-4.png',
      size: 2490
    }
  ],
  coverImage: [
    {
      fieldname: 'coverImage',
      originalname: 'd-7.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './public/temp',
      filename: 'd-7.png',
      path: 'public\\temp\\d-7.png',
      size: 150947
    }
  ]
*/
