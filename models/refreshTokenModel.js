import mongoose from "mongoose";

const refreshTokenSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    token:{type:String,required:true},
    blacklist:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now,expires:'5d'}
})
const refreshTokenModel=mongoose.model('refreshToken',refreshTokenSchema)
export default refreshTokenModel