import mongoose  from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
        const connectionInst = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDb connected Successfully on Host: ${connectionInst.connections[0].host}`);
    } catch (error) {
        console.log("MongoDB connection error",error);
        process.exit(1);
    }
};
export default connectDB;

