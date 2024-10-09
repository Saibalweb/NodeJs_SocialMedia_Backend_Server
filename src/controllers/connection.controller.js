import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Connection } from "../models/connection.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const followUser = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id){
        throw new ApiError(404,"Please Provide Unique userId");
    }
    const followingUser = await User.findById(new mongoose.Types.ObjectId(`${id}`));
    if(!followingUser){
        throw new ApiError(404,"The user does not exists!");
    }
    if(req.user._id.equals(followingUser._id)){
        throw new ApiError(404,"You cannot follow yourself!");
    }
    const alreadyFollowed = await Connection.findOne({followerId:req.user._id,followingId:followingUser._id});
    if(alreadyFollowed){
        throw new ApiError(400,"User already followed this profile");
    }
    const connection = await Connection.create({
        followerId:req.user._id,
        followingId: followingUser._id,
        isPending:false,
    });
    res.status(202).json(new ApiResponse(202,{response:connection},"Successefully Followed!"));
});
const unFollowUser = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id){
        throw new ApiError(404,"Please Provide Unique userId");
    }
    const followingUser = await User.findById(new mongoose.Types.ObjectId(`${id}`));
    if(!followingUser){
        throw new ApiError(404,"The user does not exists!");
    };
    const alreadyFollowed = await Connection.findOne({followerId:req.user._id,followingId:followingUser._id});
    if(!alreadyFollowed){
        throw new ApiError(404,"You cannot unfollow this user as You are not following this user!")
    }
    const unfollow = await Connection.findByIdAndDelete(alreadyFollowed._id);
    res.status(202).json(new ApiResponse(202,{response:unfollow},"Successfully Unfollowed!"));
});
const getFollowings = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id){
        throw new ApiError(404,"Please Provide Unique userId");
    }
    const user = await User.findById(new mongoose.Types.ObjectId(`${id}`));
    if(!user){
        throw new ApiError(404,"Invalid userId,Please provide correct UserId");
    }
    const followings = await Connection.find({followerId:user._id});
    const followingsCount = followings.length;
    res.status(202).json(new ApiResponse(202,{response:{followings,followingsCount}},"Successfully fetched followings"));
});
const getFollowers = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id){
        throw new ApiError(404,"Please Provide Unique userId");
    }
    const user = await User.findById(new mongoose.Types.ObjectId(`${id}`));
    if(!user){
        throw new ApiError(404,"Invalid userId,Please provide correct UserId");
    }
    const followers = await Connection.find({followingId:user._id});
    const followersCount = followers.length;
    res.status(202).json(new ApiResponse(202,{response:{followers,followersCount}},"Fetched Followers Successfully!"))
});
export {followUser,unFollowUser,getFollowings,getFollowers};