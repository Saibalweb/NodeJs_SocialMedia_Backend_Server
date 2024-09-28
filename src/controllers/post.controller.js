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
const updatePost = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const {title,content} = req.body;
    if(!title && !content){
        throw new ApiError(402,"Please update atleast title or Content");
    }
    const post = await Post.findById(id);
    if(!req.user._id.equals(post.owner)){
        throw new ApiError(401,"User is not authorised to edit this post!")
    }
    if(title) post.title = title;
    if(content) post.content = content;
    const updatedPost = await post.save();
    res.status(200).json(new ApiResponse(200,{response:updatedPost},"Your Post is Successfully Updated!"));
})
export {uploadPost,updatePost};