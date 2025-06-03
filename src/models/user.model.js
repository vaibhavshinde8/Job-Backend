import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    authId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Auth",
        required:true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    address:{
        type: String,
        required: true,
    },
    passoutYear: { type: Number }, // e.g. 2023
    collegeName: { type: String}, // e.g. "XYZ University"
    branch: { type: String}, // e.g. "Computer Science"
    cgpa: { type: Number }, // e.g. 8.5
    experience: { type: Number }, // in years
    skills: [{
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
          'REST API',
        ]
      }],
    resume: { type: String }, // file path or cloud link
    description: { type: String },
    githubProfile: { type: String },
    leetcodeProfile: { type: String },
    portfolioUrl: { type: String },
    profileImage: { type: String },
    projects:[{
        title: { type: String },
        description: { type: String },
        link: { type: String },
        githubLink: { type: String },
        techStack: [{ type: String }],
    }],
     // file path or cloud link
},{ timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;