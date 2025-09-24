import {v2 as cloudinary} from "cloudinary";
import fs from "fs";   //file system


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CCLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary= async (localFilePath) => {
    try{
        if(!localFilePath)return null;
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        //file has been uploaded successfully
        console.log("file has been uploaded successfully",response.url);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath)   //remove the locally saved file as the upload has failed
        return null;    }
}
export {uploadOnCloudinary}
//multer is used for file upload capabilities