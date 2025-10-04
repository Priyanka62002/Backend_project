import {Router} from "express";
import { loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

//middleware is basically jaate hue mujhse milke jaana
router.route("/register").post(
    upload.fields([    //his is a middleware that will handle the file upload
        {
            name:"avatar",
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1,
        }
    ]),
    registerUser
)
//here router will take over the route from app.js and it will route to
//https:localhost:8000/api/v1/users/register

//add another route for login  post is being used because we are taking info
router.route("/login").post(loginUser)

//we can know whether the user is logged in or not with the uth middleware
 
//secured routes
router.route("/logout").post(verifyJWT, logoutUser)   //here verifyJWT is a middleware that will verify the JWT token
//the next() is thats why used to pass the control to the next here in this case that is logoutUser

router.route("/refresh-token").post(refreshAccessToken)  //this is to refresh the access token

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)  /* */

//now we need from params
//this is how we get username
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

export default router;
