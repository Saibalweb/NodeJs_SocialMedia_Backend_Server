import 'dotenv/config';
import connectDB from "./db/index.js";


// connect Db ---->
connectDB();





// this is a way of connecting to mongo db server

/*

;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (err)=>{
            console.log("Error: ",err);
            throw err;
        });
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error: ", error);
    }
})()

*/