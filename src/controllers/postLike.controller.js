import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { PostLike } from "../models/postLike.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";

const addLiketoPost = asyncHandler(async(req,res)=>{
    const postId = req.params.postId;
    if(!postId){
        throw new ApiError(405,"Please provide unique postId")
    }
    const post = await Post.findById(new mongoose.Types.ObjectId(`${postId}`));
    if(!post){
        throw new ApiError(406,"These post does not exists");
    }
    const postLike = await PostLike.findOne({postId:post._id,ownerId:req.user._id})
    if(postLike){
        throw new ApiError(406,"The user already liked the post")
    }
    const like = await PostLike.create({
        postId:post._id,
        ownerId:req.user._id
    })
    req.status(202).json(new ApiResponse(202,{response:like},"Added Like to this Post"))
});
const removeLiketoPost = asyncHandler(async(req,res)=>{
    const postId = req.params?.postId;
    if(!postId){
        throw new ApiError(405,"Please provide unique postId")
    };
    const post = await Post.findById(new mongoose.Types.ObjectId(`${postId}`));
    if(!post){
        throw new ApiError("This post does not exists");
    }
    const postLike = await PostLike.findOne({postId:post?._id,ownerId:req.user?._id});
    if(!postLike){
        throw new ApiError(405,"User have not liked this post");
    }
    const deletedPostLike = await PostLike.findByIdAndDelete(postLike?._id);
    res.status(200).json(new ApiResponse(200,{response:deletedPostLike},"You remove like"))
})
export {addLiketoPost,removeLiketoPost}