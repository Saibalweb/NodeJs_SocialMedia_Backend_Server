import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";

// connect Db ---->
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at Port : ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.log("MonogoDb connection Error: ", err);
  });

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
