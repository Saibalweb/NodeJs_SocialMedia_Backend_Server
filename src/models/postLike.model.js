import mongoose, { Schema } from "mongoose";

const postLikeSchema = new Schema({
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
}, { timestamps: true });

export const PostLike = mongoose.model("PostLike",postLikeSchema);
