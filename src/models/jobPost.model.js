// models/JobPost.js

import mongoose from 'mongoose';
const jobPostSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'company', required: true },
  companyName:{type:String,required:true}, // reference to the company
  JobTitle: { type: String, required: true },           // e.g. Software Engineer
  experience: { type: String,required:true },                     // e.g. "0-2 years", "3+ years"
  ctc: { type: String ,required:true},                            // e.g. "6 LPA", "10-12 LPA"
  eligibilityCriteria: { type: String,required:true },            // custom eligibility text
  skillsRequired: [{
    type: String,
    enum: [
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
    ]
  }],               // e.g. ["JavaScript", "React", "Node.js"]
  responsibilities: { type: String },               // job description or key tasks
  location: [{ type: String }],                       // optional (could be branch-specific)
  deadline: { type: Date },  
  jobType:{type:String},
  description:{
    type:String
  },
  position:{
    type:Number,
    required:true
  } ,                           // optional - for expiring jobs
  isActive: { type: Boolean, default: true }        // for soft-deletion or archiving
},{ timestamps: true });

const JobPost = mongoose.model('JobPost', jobPostSchema);
export default JobPost;
