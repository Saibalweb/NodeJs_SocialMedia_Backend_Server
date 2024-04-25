import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async localFilePath => {
  try {
    if (!localFilePath) return null;
    //upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    });
    console.log("File has been successfully uploaded to cloudinary : ",response.url);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);//delete the local file as the file uploading to cloudinary is failed
    return null;
  }
};
export {uploadOnCloudinary};