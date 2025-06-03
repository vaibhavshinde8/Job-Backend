import { ApiResponse } from "../util/ApiResponse.js";
import { ApiError } from "../util/ApiError.js";
import Interviewer from "../models/interviwer.model.js";
import  {auth as Auth}  from "../models/auth.model.js";
import { uploadOnCloudinary } from "../util/Cloudnary.js";
const createProfile = async (req, res) => {
  try {
    const authId = req.user._id;
    let data = req.body;

    // Validate required fields
    if (!data.fullName || !data.skills || data.skills.length === 0) {
      return res.status(400).json(new ApiError(400, "Please provide all the required fields"));
    }

    // Ensure each skill is an object with 'name' key
    data.skills = data.skills.map(skill => ({ name: skill }));

    // Check if user exists by authId
    const email = await Auth.findById(authId).select('email');
    if (!email) {
      return res.status(400).json(new ApiError(400, "User not found"));
    }

    // Add email and authId to data
    data.email = email.email; // Ensure we're using the email string value
    data.authId = authId;

    // Create new profile
    const profile = await Interviewer.create(data);

    // Return success response with profile details
    return res.status(201).json(new ApiResponse(201, profile, "Profile created successfully"));

  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, error.message));
  }
};


const updateProfile = async (req, res) => {
    try {
      const authId = req.user._id;
      const data = req.body;
  
      // Validate required fields
      if (!data.fullName || !data.skills || data.skills.length === 0) {
        return res.status(400).json(new ApiError(400, "Please provide all the required fields"));
      }
  
      // Find profile by authId
      const profile = await Interviewer.findOne({ authId: authId });
      if (!profile) {
        return res.status(400).json(new ApiError(400, "Profile not found"));
      }
  
      // Update profile with the new data
      const updatedProfile = await Interviewer.findByIdAndUpdate(
        profile._id, // Update by profile ID
        { $set: data },
        { new: true, runValidators: true }
      );
  
      // Return success response with updated profile details
      return res.status(200).json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
  
    } catch (error) {
      return res.status(500).json(new ApiError(500, error.message));
    }
  };
 
 
  // Function to upload work proof
  const uploadWorkProof = async (req, res) => {
    try {
      const authId = req.user._id;
      const { title, link } = req.body;
  
      // Validate required fields
      if (!title || !link) {
        return res.status(400).json(new ApiError(400, "Please provide all required fields: title, link, and type"));
      }
  
      // Validate work proof type
  
      // Find the interviewer profile
      const profile = await Interviewer.findOne({ authId: authId });
      if (!profile) {
        return res.status(404).json(new ApiError(404, "Profile not found"));
      }
  
      // Add work proof details to the profile
      profile.workProof.push({
        title,
        link,
        uploadedAt: new Date(),
      });
  
      // Save the updated profile
      await profile.save();
  
      // Return success response
      return res.status(200).json(new ApiResponse(200, profile, "Work proof uploaded successfully"));
  
    } catch (error) {
      return res.status(500).json(new ApiError(500, error.message));
    }
  };
  
  async function addProfilePic(req,res){
      try {
        //console.log("Enterd")
          const authId=req.user._id
          //check if user already exists
         // console.log("user finding started")
          const user=await Interviewer.findOne({authId:authId})
        //  console.log("user finding ended")
          if(!user){
              return res.status(400).json(new ApiError(400, "User not found."));
          }
          const file=req.files?.profilePic[0];
         // console.log("file+="+file);
          const result=await uploadOnCloudinary(file.path,"profilePic")
         console.log("result"+result)
          //update profilePic in database
          user.profileImage=result.secure_url;
          const savedUser=await user.save();
          return res.status(200).json(new ApiResponse(200,savedUser,"Profile picture updated successfully"));
      } catch (error) {
        console.log(error)
          return res.status(500).json(new ApiError(500, "Internal Server Error", error.message));
      }
  }
async function getProfile(req,res){
    try {
        const authId=req.user._id
        //check if user already exists
        const profile=await Interviewer.findOne({authId:authId})
        if(!profile){
            return res.status(404).json(new ApiError(404, "Profile not found."));
        }
        return res.status(200).json(new ApiResponse(200,profile,"Profile retrieved successfully"));
    } catch (error) {
       
            return res.status(500).json(new ApiError(500, "Internal Server Error", error.message));
        
    }
}
export { createProfile, updateProfile, uploadWorkProof,addProfilePic,getProfile };