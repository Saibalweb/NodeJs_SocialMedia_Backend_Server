import mongoose,{Schema} from "mongoose";
const connectionSchema = new Schema({
    followerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    followingId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    isPending:{
        type:Boolean,
    }
},{timestamps:true});

export const Connection = mongoose.model("Connection",connectionSchema);