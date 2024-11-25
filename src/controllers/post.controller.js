import mongoose, { connect } from "mongoose";
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
    const id = req.params.id;
    console.log(req.params);
    if(!id){
        throw new ApiError(400,"Please provide Unique id");
    }
    const allPosts = await Post.find({owner:new mongoose.Types.ObjectId(`${id}`)});
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
const getPostByNum = asyncHandler(async(req,res)=>{
    const userId = req.params.id;
    const {page,size}= req.query;
    if(!userId){
        throw new ApiError(405,"Please Provide user Unique id");
    }
    if(!page || !size){
        throw new ApiError(406,"Please provide both page and size in query")
    }
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);
    const skip = (pageNumber-1)*pageSize;
    // const posts = await Post.find({owner:new mongoose.Types.ObjectId(`${userId}`)})
    // .skip(skip)
    // .limit(pageSize)
    // .sort({createdAt:-1});
        const posts = await Post.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(`${userId}`)
                }
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $skip:skip
            },
            {
                $limit:pageSize
            },
            {
                $lookup:{
                    from:"postlikes",
                    localField:"_id",
                    foreignField:"postId",
                    as:"postLike"
                }
            },
            {
                $lookup:{
                    from:"comments",
                    localField:"_id",
                    foreignField:"postId",
                    as:"comment"
                }
            },
            {
                $addFields:{
                    liked:{
                        $gt:[
                            {
                                $size:{
                                    $filter:{
                                        input:"$postLike",
                                        as:"like",
                                        cond:{$eq:["$$like.ownerId",req.user._id]}
                                    }
                                }
                            },0
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    owner:1,
                    content:1,
                    img:1,
                    audience:1,
                    createdAt: 1,
                    postLikeCount: { $size: "$postLike" },
                    commentCount: { $size: "$comment" },
                    liked:1
                }
            }
        ])
    const totalPosts = await Post.countDocuments({owner:new mongoose.Types.ObjectId(`${userId}`)});

    res.status(200).json(new ApiResponse(200,{
        posts,
        totalPages:Math.ceil(totalPosts/pageSize),
        currentPage:pageNumber,
        totalPosts
    },"Fetched post successfully!"));
})
export {uploadPost,updatePost,deletePost,getAllPost,getPostById,getPostByNum};