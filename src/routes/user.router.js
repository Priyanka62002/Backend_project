import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

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



export default router;
