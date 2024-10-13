import transporter from "../config/emailConfig.js";
import emailModel from "../models/emailVerificationModel.js";
import dotenv from 'dotenv'
dotenv.config()
const SendEmailVerificationOTP=async(user)=>{
    try{
        const otp=Math.floor(1000+Math.random()*9000);
        await new emailModel({userId:user._id,otp}).save()
        const otpVerificationLink=`${process.env.FRONTEND_HOST}/account/verify-email`
        await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to:user.email,
            subject:"OTP - Verify your email",
            html:`<p>Dear ${user.name},</p><p>Thank you for signing up in our website. We have sent you an OTP to verify in our website. ${otpVerificationLink}</p><h2>OTP - ${otp}</h2>`
        })
        console.log("OTP sent ...")
    }catch(error){
        console.log(error)
    }
}
export default SendEmailVerificationOTP