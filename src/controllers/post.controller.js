import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const uploadPost = asyncHandler(async(req,res)=>{
    const {title,content,audience} = req.body;
    const postImg = req?.files?.postImg ? req?.files?.postImg[0]?.path :"";
    if(!content && !postImg){
        throw new ApiError(400,"Please upload atleast content or postImg");
    }
    if(!audience){
        throw new ApiError(400,"You must provide audience field");
    }
    const postImgUri = await uploadOnCloudinary(postImg);
    const post = await Post.create({
        owner:req.user._id,
        title,
        content,
        audience,
        img:postImgUri?.url,
    })

    return res.status(200).json(new ApiResponse(200,{response:post},"Successfully post Uploaded!"));
})
export {uploadPost};