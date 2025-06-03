import mongoose from "mongoose";
const interviewRecordings=new mongoose.Schema({
    interviewId:{
        type:String,
        required:true
    },
    video: {
        type: [String],  // This will store an array of video file paths
        required: true,
      },
},{timestamps:true});
const InterviewRecording=new mongoose.model('InterviewRecording',interviewRecordings);
export default InterviewRecording;