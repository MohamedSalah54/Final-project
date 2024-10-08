import mongoose from "mongoose";


const connectToMongo = async ()=>{

    try{
        const connect = await mongoose.connect(process.env.MONGO_URl)
        console.log(`Connected to database successfully! ${connect.connection.host}`);
        

    }catch(error){
        console.error(`Error to connect to mongoDB ${error.message}`)
        process.exit(1)
    }
}


export default connectToMongo;