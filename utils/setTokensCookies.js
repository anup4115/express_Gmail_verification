
const setTokensCookies=async(res,accessToken,newaccessTokenExp,refreshToken,newrefreshTokenExp)=>{
    try{
        const accessTokenMaxAge=(newaccessTokenExp - Math.floor(Date.now()/1000))*1000
        const refreshTokenMaxAge=(newrefreshTokenExp - Math.floor(Date.now()/1000))*1000

        res.cookie('accessToken',accessToken,{
            httpOnly:true,
            secure:true,
            maxAge:accessTokenMaxAge
        })
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:true,
            maxAge:refreshTokenMaxAge
        })
    }catch(error){
        console.log(error)
    }
}
export default setTokensCookies