import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
console.log(process.env.MONGODB_URL)
const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`mongodb+srv://JOB:Abhishek%40123@cluster0.7w83x.mongodb.net/${DB_NAME}`)
        console.log("Connected to MongoDB"+connectionInstance.connection.host)
    }
    catch(error){
        console.log("MongoDB Connection error"+error)
        process.exit(1);
    }
}
export default connectDB;