import jwt from 'jsonwebtoken'
import refreshTokenModel from '../models/refreshTokenModel.js'
import userController from '../controllers/userControllers.js'
const generateTokens=async(user)=>{
    try{
        const payload={_id:user._id}
        const accessTokenExp=Math.floor(Date.now()/1000)+100
        const accessToken=jwt.sign({...payload,exp:accessTokenExp},process.env.JWT_ACCESS_TOKEN)

        const refreshTokenExp=Math.floor(Date.now()/1000)+60*60*24*5
        const refreshToken=jwt.sign({...payload,exp:refreshTokenExp},process.env.JWT_REFRESH_TOKEN)

        await refreshTokenModel.findOneAndDelete({userId:user._id})
        await new refreshTokenModel({userId:user._id,token:refreshToken}).save()

        return Promise.resolve({accessToken,accessTokenExp,refreshToken,refreshTokenExp})
    }catch(error){
        console.log(error)
    }
}
export default generateTokens