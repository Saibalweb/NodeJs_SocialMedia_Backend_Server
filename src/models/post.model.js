import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true 
    },
    title:String,
    content:String,
    img:String,
    video:String,
    audience:{
        type:String,
        enum:['public','private','friends'],
        required:true,
    }
},{timestamps:true})
export const Post = mongoose.model("Post",postSchema);