import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadComment = asyncHandler(async(req,res)=>{
    const {postId,content}= req.body;
    if(!postId || !content){
        throw new ApiError(403,"Please provide both postId & content!");
    }
    const postObjId =new mongoose.Types.ObjectId(`${postId}`);
    const post = await Post.findById(postObjId)
    if(!post){
        throw new ApiError(404,"This post does not exists!");
    }
    const comment = await Comment.create({
        postId:post._id,
        ownerId:req.user._id,
        content
    })
    res.status(202).json(new ApiResponse(202,{response:comment},"You commented Succefully!"))
});
const updateComment = asyncHandler(async(req,res)=>{
    const commentId = req.params.id;
    const {content} = req.body;
    if(!commentId){
        throw new ApiError(404,"Please Provide comment unique Id");
    }
    if(!content){
        throw new ApiError(404,"Cannot do Empty Comment!");
    }
    const [comment] = await Comment.find({_id:new mongoose.Types.ObjectId(`${commentId}`)});
    if(!comment){
        throw new ApiError(405,"This comment doesn't exists");
    }
    if(!req.user._id.equals(comment.ownerId)){
        throw new ApiError(406,"You are not authorised to edit this comment")
    }
    comment.content = content;
    const updateComment = await comment.save();
    res.status(203).json(new ApiResponse(203,{response:updateComment},"Comment Updated Successefully!"))

})
const deleteComment = asyncHandler(async(req,res)=>{
    const commentId = req.params.id;
    if(!commentId){
        throw new ApiError(405,"Please Provide comment Id!");
    }
    const comment = await Comment.findById(new mongoose.Types.ObjectId(`${commentId}`));
    if(!req.user._id.equals(comment.ownerId)){
        throw new ApiError(405,"You are not authorised to delete this comment")
    }
    const deletedComment = await Comment.findByIdAndDelete(comment._id);
    res.status(202).json(new ApiResponse(202,{response:deletedComment},"Your comment deleted successefully"))
});
const getAllcomments = asyncHandler(async(req,res)=>{
    const postId = req.params.postId;
    if(!postId){
        throw new ApiError(406,"Please provide post Unique id");
    }
    const comments = await Comment.find({postId:new mongoose.Types.ObjectId(`${postId}`)});
    res.status(202).json(new ApiResponse(202,{response:comments},"Fetched All comments Successfully"));
})
export {uploadComment,updateComment,deleteComment,getAllcomments};