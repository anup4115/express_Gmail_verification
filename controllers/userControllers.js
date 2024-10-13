import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import SendEmailVerificationOTP from "../utils/SendEmailVerificationOTP.js";
import emailModel from "../models/emailVerificationModel.js";
import generateTokens from "../utils/generateTokens.js";
import setTokensCookies from "../utils/setTokensCookies.js";
class userController{
    static register_user=async(req,res)=>{
        try{
            const {name, email, password, password_confirmation} = req.body 
            if(!name || !email || !password || !password_confirmation){
                return res.status(400).json({status:"failed",msg:"All Fields are Required"})
            }
            if(password.length<5){
                return res.status(400).json({status:"failed",msg:"Password must be atleast of 6 characters"})
            }
            if(password !==password_confirmation){
                return res.status(400).json({status:"failed",msg:"Password does not match with Confirm Password"})
            }
            const existingUser=await userModel.findOne({email})
            if(existingUser){
                return res.status(401).json({status:"failed",msg:"Email has already been registered before"})
            }
            const salt=await bcrypt.genSalt(Number(process.env.SALT))
            const hashedPassword=await bcrypt.hash(password,salt)
            const newUser=await new userModel({name,email,password:hashedPassword}).save()
            await SendEmailVerificationOTP(newUser)
            return res.status(201).json({status:"success",msg:"Email registration successful",user:{userId:newUser._id,name:newUser.name,email:newUser.email}})
        }catch(errror){
            console.log(errror)
        }
    }
    static verify_email=async(req,res)=>{
        try{
            const {email, otp}=req.body 
            if(!email || !otp){
                return res.status(400).json({status:"failed",msg:"All Fields are Required"})
            }
            const existingUser=await userModel.findOne({email})
            if(!existingUser){
                return res.status(404).json({status:"failed",msg:"Email not registered"})
            }
            if(existingUser.is_verified){
                return res.status(401).json({status:"failed",msg:"Email already verified"})
            }
            const emailVerification=await emailModel.findOne({userId:existingUser._id,otp})
            if(!emailVerification){
                if(!existingUser.is_verified){
                    await SendEmailVerificationOTP(existingUser)
                    return res.status(401).json({status:"failed",msg:"Invalid OTP, new OPT has been sent to your email"})
                }
                return res.status(401).json({status:"failed",msg:"Invalid OTP"})
            }
            const currentTime=new Date()
            const expirationTime=new Date(emailVerification.createdAt.getTime()+15*60*1000)
            if(currentTime>expirationTime){
                await SendEmailVerificationOTP(existingUser)
                return res.status(401).json({status:"failed",msg:"OTP expired, new OTP has been sent"})
            }
            existingUser.is_verified = true 
            await existingUser.save()
            await emailModel.deleteMany({userId:existingUser._id})
            return res.status(200).json({status:"success",msg:"Email verified"})
        }catch(error){
            console.log(error)
        }
    }
    //Generate Token
    //Set cookies
    //send response with tokens
    static login_user=async(req,res)=>{
        try{
            const {email, password} = req.body 
            if(!email || !password){
                return res.status(400).json({status:"failed",msg:"All Fields are Required"})
            }
            const existingUser=await userModel.findOne({email})
            if(!existingUser){
                return res.status(404).json({status:"failed",msg:"Email not registered"})
            }
            if(!existingUser.is_verified){
                return res.status(400).json({status:"failed",msg:"Email not verified"})
            }
            const isMatch=await bcrypt.compare(password,existingUser.password)
            if(!isMatch){
                return res.status(400).json({status:"failed",msg:"Incorrect Email or Password"})
            }
            //Generate Token
            const {accessToken,accessTokenExp,refreshToken,refreshTokenExp}=await generateTokens(existingUser)

            setTokensCookies(res,accessToken,accessTokenExp,refreshToken,refreshTokenExp)

            return res.status(200).json({status:"success",msg:"Login Successful",user:{userId:existingUser._id,name:existingUser.name,email:existingUser.email},accessToken:accessToken,refreshToken:refreshToken,accessTokenExp:accessTokenExp,is_auth:true})
        }catch(error){
            console.log(error)
        }
    }
}
export default userController