import mongoose from 'mongoose'

const interviewSchema = new mongoose.Schema({
    interviwerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Interviwer',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'rejected'],
      default: 'upcoming',
    },
  });
  
const Interview=new mongoose.model('Interview', interviewSchema);
export default Interview