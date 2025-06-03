import dotenv from 'dotenv';
import updateInterviewStatuses from './util/updateInterviewStatuses.js'
dotenv.config({
    path: './.env'
})
// console.log('ABhi')
import app from './app.js';
import connectDB from './DB/index.js';
connectDB().then(()=>
    app.listen(process.env.PORT||8001, (req,res) => {
        console.log(`server is running`)
    })
).catch((error)=>{
    console.log("Index file error"+error)
})
setInterval(() => {
    updateInterviewStatuses();
  }, 1 * 60 * 1000); //