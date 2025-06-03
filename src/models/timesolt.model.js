import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  startTime: { type:String, required: true },
  endTime:{
    type:String,
    required: true
  },
  date:{
    type:Date,
    required: true
  },
  skills:{
    type: [String], required: true
  }
  ,
  InterviewerId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Interviewer'
  },
  isBooked:{
    type:Boolean,
    default:false
  }
})
const TimeSlot= mongoose.model('TimeSlot', timeSlotSchema);
export default TimeSlot;