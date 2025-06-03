import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import TimeSlot from "../models/timesolt.model.js";
import Interview from "../models/interviwe.model.js";
import Interviewer from "../models/interviwer.model.js";
import User from "../models/user.model.js";
const book = async (req, res) => {
  try {
    const { skill, date } = req.body;
    console.log("Skill:", skill);

    const authId = req.user._id;
    const student = await User.findOne({ authId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Normalize the date range for the day
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const endOfDate = new Date(inputDate);
    endOfDate.setHours(23, 59, 59, 999);

    // Fetch all matching available slots for skill & date
    const matchingSlots = await TimeSlot.find({
      skills: { $in: [skill] },
      date: { $gte: inputDate, $lte: endOfDate },
      isBooked: false
    });

    const slotDateStr = inputDate.toISOString().split('T')[0];

    let validSlot = null;
    let scheduledStartTime = null;
    let scheduledEndTime = null;

    // Find the first slot with at least 1 hour of time
    for (let slot of matchingSlots) {
      const fullStart = new Date(`${slotDateStr}T${slot.startTime}`);
      const fullEnd = new Date(`${slotDateStr}T${slot.endTime}`);

      const timeDiff = (fullEnd - fullStart) / (1000 * 60); // in minutes

      if (timeDiff >= 60) {
        validSlot = slot;
        scheduledStartTime = fullStart;
        scheduledEndTime = new Date(fullStart.getTime() + 60 * 60 * 1000);
        break;
      }
    }

    if (!validSlot) {
      return res.status(404).json({
        message: "No available 1-hour slot for this skill on this date."
      });
    }

    // Format end time properly
    const formattedEndTime = `${String(scheduledEndTime.getHours()).padStart(2, '0')}:${String(scheduledEndTime.getMinutes()).padStart(2, '0')}`;

    // Create interview with correct 1-hour window
    await Interview.create({
      userId: student._id,
      interviwerId: validSlot.InterviewerId,
      skill,
      date: inputDate,
      startTime: validSlot.startTime,
      endTime: formattedEndTime
    });

    // Add 1.5-hour buffer after scheduled start
    const updatedStartTime = new Date(scheduledStartTime.getTime() + 90 * 60 * 1000);
    const updatedStartStr = `${String(updatedStartTime.getHours()).padStart(2, "0")}:${String(updatedStartTime.getMinutes()).padStart(2, "0")}`;
    const originalEndTime = new Date(`${slotDateStr}T${validSlot.endTime}`);

    // Update or close the slot
    if (updatedStartTime < originalEndTime) {
      await TimeSlot.updateOne(
        { _id: validSlot._id },
        { $set: { startTime: updatedStartStr } }
      );
    } else {
      await TimeSlot.updateOne(
        { _id: validSlot._id },
        { $set: { isBooked: true } }
      );
    }

    return res.status(200).json({
      message: "Interview scheduled successfully.",
      time: `${validSlot.startTime} - ${formattedEndTime}`
    });

  } catch (error) {
    console.log("Booking Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


  
// get intreviews for particular studnets
const getInterviwesBystudent=async (req,res)=>{
try {
        const authId=req.user._id;
        const studentId=await User.findOne({authId:authId});
        console.log(studentId)
        const data=await Interview.find({userId:studentId._id});
        console.log(data);
       res.status(200).json(new ApiResponse(200,data,"data fetched succesfully"));
} catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError("Internal Server Error", error.message));
}
}
const getInterviwesByInterviwer=async(req,res)=>{
    try {
        const authId=req.user._id;
        const interviewerId=await Interviewer.findOne({authId:authId})
        const data=await Interview.find({interviwerId:interviewerId._id});
        res.status(200).json(new ApiResponse(200,data,"data fetched succesfully"));
    } catch (error) {
        console.log(error);
    return res.status(500).json(new ApiError("Internal Server Error", error.message));
    }
}
const addSlot = async (req, res) => {
  try {
    const { endTime, date, startTime, skills } = req.body;

    if (!endTime || !date || !startTime || !skills) {
      return res.status(400).json(new ApiError(400, "Please fill up all details"));
    }

    const authId = req.user._id;
    const interviewer = await Interviewer.findOne({ authId });

    if (!interviewer) {
      return res.status(400).json(new ApiError(400, "Wrong details"));
    }

    const slotDate = new Date(date);
    const formattedDateStr = slotDate.toISOString().split('T')[0];

    const newStart = new Date(`${formattedDateStr}T${startTime}`);
    const newEnd = new Date(`${formattedDateStr}T${endTime}`);

    // 🔍 Check for overlapping slots for this interviewer on the same date
    const conflictingSlot = await TimeSlot.findOne({
      InterviewerId: interviewer._id,
      date: slotDate,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingSlot) {
      return res.status(400).json(new ApiError(400, "Slot overlaps with an existing one"));
    }

    // ✅ Save new slot
    const newSlot = new TimeSlot({
      startTime,
      endTime,
      date: slotDate,
      skills,
      InterviewerId: interviewer._id
    });

    await newSlot.save();
    return res.status(200).json(new ApiResponse(200, {}, "Slot booked successfully"));

  } catch (error) {
    console.log("AddSlot Error:", error);
    return res.status(500).json(new ApiError("Internal Server Error", error.message));
  }
};

export{
    book,getInterviwesByInterviwer,getInterviwesBystudent,addSlot
}