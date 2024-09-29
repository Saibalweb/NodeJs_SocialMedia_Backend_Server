import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema(
  {
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  },
);
export const Comment = mongoose.model("Comment",commentSchema);
