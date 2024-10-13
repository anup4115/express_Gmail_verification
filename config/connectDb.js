import mongoose from "mongoose";

const connectDB=async(DB_URL)=>{
    try{
        const DB_OPTIONS={
            dbName:process.env.DBNAME
        }
        await mongoose.connect(DB_URL,DB_OPTIONS)
        console.log("Connected...")
    }catch(error){
        console.log(error)
    }
}
export default connectDB