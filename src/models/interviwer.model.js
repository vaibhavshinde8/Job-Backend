// interviewer.model.js
import mongoose from "mongoose";

const allowedSkills = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'SQL',
  'HTML',
  'CSS',
  'TypeScript',
  'Django',
  'Flask',
  'AWS',
  'Docker',
  'Kubernetes',
  'Git',
  'Linux',
  'REST API'
];

const interviewerSchema = new mongoose.Schema({
    authId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  profilePicture: { type: String },
  bio: { type: String },
  linkedin: { type: String },
  experienceYears: { type: Number },

  skills: [
    {
      name: { type: String, enum: allowedSkills, required: true },
    }
  ],

  workProof: [
    {
      title: { type: String },
      link: { type: String },
    
    }
  ],

  isActive: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Interviewer = mongoose.model("Interviewer", interviewerSchema);
export default Interviewer;
