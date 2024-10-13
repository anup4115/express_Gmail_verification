import mongoose from "mongoose";

const emailSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,default:Date.now,expires:'15m'}
})
const emailModel=mongoose.model('emailOTP',emailSchema)
export default emailModel