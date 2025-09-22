import dotenv from 'dotenv';
import connectDB from "./db/index.js";
// import app from "./app.js";  <--- default export 
import {app} from "./app.js";   // <--- named export 

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR : ",error)
        throw error
    })
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server listening on port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`Error : MongoDB connection failed..!! ${err}`)
})