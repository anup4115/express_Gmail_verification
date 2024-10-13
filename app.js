import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/connectDb.js'
import route from './routes/userRoute.js'
const app=express()
const port=process.env.PORT 
const DB_URL=process.env.DB_URL
const corsOptions={
    origin:process.env.FRONTEND_HOST,
    credentials:true,
    optionsSuccessStatus:200 
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieparser())
app.use('/api/user',route)
connectDB(DB_URL)
app.listen(port,()=>{
    console.log(`Server at http://localhost:${port}`)
})