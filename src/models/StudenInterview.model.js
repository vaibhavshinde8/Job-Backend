import mongoose from "mongoose";

const subtopicMarkSchema = new mongoose.Schema({}, { strict: false });

const interviewRecordSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  subtopicMarks: {
    type: subtopicMarkSchema,
    required: true
  }
});

const studentInterviewSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  interviewRecords: [interviewRecordSchema]
}, { timestamps: true });

 const StudentInterview = mongoose.model("StudentInterview", studentInterviewSchema);
export default StudentInterview