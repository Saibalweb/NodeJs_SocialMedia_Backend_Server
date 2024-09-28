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
    if(!id) {
        throw new ApiError(402,"Please provide the post unique id");
    }
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
    if(!updatedPost){
        throw new ApiError(505,"Post update failed!")
    }
        
    res.status(200).json(new ApiResponse(200,{response:updatedPost},"Your Post is Successfully Updated!"));
})
const deletePost = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id) throw new ApiError(404,"Please Provide post Id");

    const post = await Post.findById(id);
    if(!req.user._id.equals(post.owner)){
        throw new ApiError(405,"You are not authorized to delete this Post!")
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse(200,{},"The Post is successfully deleted"));
})
const getAllPost = asyncHandler(async(req,res)=>{
    const id = req.user._id;
    const allPosts = await Post.find({owner:id});
    res.status(202).json(new ApiResponse(202,{response:allPosts},"Successfully Fetched all Posts"))
})
const getPostById = asyncHandler(async(req,res)=>{
    const postId = req.params.id;
    if(!postId){
        throw new ApiError(400,"Please Provide valid post Id");
    }
    console.log(req.params);
    const post = await Post.findById(postId);
    console.log(post);
    if(!post) throw new ApiError(500,"The post id is not valid");
    res.status(200).json(new ApiResponse(200,{response:post},"Post fetched successefully!"))
})
export {uploadPost,updatePost,deletePost,getAllPost,getPostById};