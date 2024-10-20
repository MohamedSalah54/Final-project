import express from 'express';
import connectToMongo from './db/connection.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';

dotenv.config()





const port =  process.env.PORT 
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoute)
app.use("/api/notification",notificationRoute)

app.listen(port,()=>{
    console.log(`database is running on port ${port}`);
    connectToMongo()
    
})